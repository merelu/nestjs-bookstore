import { CommonErrorCodeEnum } from '@domain/common/enum/error-code.enum';
import { ExceptionService } from '@infra/services/exception/exception.service';
import { UseCaseProxy } from '@infra/usecases-proxy/usecases-proxy';
import { UseCasesProxyModule } from '@infra/usecases-proxy/usecases-proxy.module';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LoginUseCases } from 'src/usecases/auth/login.usecases';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UseCasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUseCaseProxy: UseCaseProxy<LoginUseCases>,
    private readonly exceptionService: ExceptionService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string) {
    if (!username || !password) {
      throw this.exceptionService.badRequestException({
        error_code: CommonErrorCodeEnum.INVALID_PARAM,
        error_text: 'email or password missing',
      });
    }
    const user = await this.loginUseCaseProxy
      .getInstance()
      .validateUserForLocalStrategy(username, password);

    if (!user) {
      throw this.exceptionService.forbiddenException({
        error_code: CommonErrorCodeEnum.UNAUTHORIZED,
        error_text: 'Invalid email or password',
      });
    }
    return user;
  }
}
