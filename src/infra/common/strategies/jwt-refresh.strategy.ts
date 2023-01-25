import { IJwtPayload } from '@domain/adpaters/jwt.interface';
import { CommonErrorCodeEnum } from '@domain/common/enum/error-code.enum';
import { EnvironmentConfigService } from '@infra/config/environment-config/environment-config.service';
import { ExceptionService } from '@infra/services/exception/exception.service';
import { UseCaseProxy } from '@infra/usecases-proxy/usecases-proxy';
import { UseCasesProxyModule } from '@infra/usecases-proxy/usecases-proxy.module';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { LoginUseCases } from 'src/usecases/auth/login.usecases';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: EnvironmentConfigService,
    private readonly exceptionService: ExceptionService,
    @Inject(UseCasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let token = request?.cookies?.Refresh || '';

          if (token.startsWith('Bearer ')) {
            token = token.substring(7, token.length);
          } else {
            throw this.exceptionService.unauthorizedException({
              error_code: CommonErrorCodeEnum.UNAUTHORIZED,
              error_text: '토큰이 없거나 형식이 올바르지 않습니다.',
            });
          }
          return token;
        },
      ]),
      secretOrKey: configService.getJwtRefreshSecret(),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: IJwtPayload) {
    const token = request?.cookies?.Refresh;

    const signiture = token.substring(7, token.length).split('.')[2];

    const isValid = await this.loginUsecaseProxy
      .getInstance()
      .compareRefreshTokenHash(payload.sub, signiture);

    if (!isValid) {
      throw this.exceptionService.unauthorizedException({
        error_code: CommonErrorCodeEnum.UNAUTHORIZED,
        error_text: '유효하지 않은 토큰입니다.',
      });
    }
    const user = await this.loginUsecaseProxy
      .getInstance()
      .validateUserForJwtStrategy(payload.sub);

    if (!user) {
      throw this.exceptionService.unauthorizedException({
        error_code: CommonErrorCodeEnum.UNAUTHORIZED,
        error_text: '유효하지 않은 토큰입니다.',
      });
    }

    return user;
  }
}
