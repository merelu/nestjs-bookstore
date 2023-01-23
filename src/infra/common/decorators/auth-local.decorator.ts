import { applyDecorators, UseGuards } from '@nestjs/common';
import { LoginGuard } from '../guards/login.guard';

export function AuthLogin() {
  return applyDecorators(UseGuards(LoginGuard));
}
