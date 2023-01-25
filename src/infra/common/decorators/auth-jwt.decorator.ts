import { FormatException } from '@infra/controller/exception.format';
import { applyDecorators, CanActivate, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

// eslint-disable-next-line @typescript-eslint/ban-types
export function AuthJwt(...guards: (Function | CanActivate)[]) {
  return applyDecorators(
    UseGuards(JwtAuthGuard, ...guards),
    ApiCookieAuth(),
    ApiUnauthorizedResponse({
      description: '인증 토큰이 전달되지 않았거나 유효하지 않은 경우',
      type: FormatException,
    }),
  );
}
