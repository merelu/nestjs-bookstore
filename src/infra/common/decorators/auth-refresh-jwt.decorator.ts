import { FormatException } from '@infra/controller/exception.format';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';

// eslint-disable-next-line @typescript-eslint/ban-types
export function AuthRefreshJwt() {
  return applyDecorators(
    UseGuards(JwtRefreshGuard),
    ApiCookieAuth(),
    ApiUnauthorizedResponse({
      description: '리프레시 토큰이 전달되지 않았거나 유효하지 않은 경우',
      type: FormatException,
    }),
  );
}
