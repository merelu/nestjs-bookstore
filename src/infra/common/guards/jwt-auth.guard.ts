import { IException } from '@domain/adpaters/exception.interface';
import { CommonErrorCodeEnum } from '@domain/common/enum/error-code.enum';
import { ExceptionService } from '@infra/services/exception/exception.service';
import { Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(@Inject(ExceptionService) private exceptionService: IException) {
    super();
  }

  handleRequest<UserModel>(err: any, user: UserModel) {
    if (err || !user) {
      throw (
        err ||
        this.exceptionService.unauthorizedException({
          error_code: CommonErrorCodeEnum.UNAUTHORIZED,
          error_text: 'Unauthorized access token',
        })
      );
    }
    return user;
  }
}
