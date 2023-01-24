import { RoleEnum } from '@domain/common/enum/role.enum';
import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: RoleEnum[]) => SetMetadata('roles', roles);
