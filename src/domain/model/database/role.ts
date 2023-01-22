import { RoleEnum } from '@domain/common/enum/role.enum';
import { PickType } from '@nestjs/mapped-types';
import { CommonModel } from '../common/common';

export interface IRoleModel {
  id: number;
  userId: number;
  role: RoleEnum;
}

export class RoleModel extends CommonModel implements IRoleModel {
  userId: number;
  role: RoleEnum;
}

export class CreateRoleModel extends PickType(RoleModel, ['userId', 'role']) {}
