import { UserModelWithoutPassword } from '@domain/model/database/user';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserModelWithoutPassword = request.user;

    return data ? user?.[data as keyof UserModelWithoutPassword] : user;
  },
);
