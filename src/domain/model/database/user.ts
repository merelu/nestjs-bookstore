import { PickType } from '@nestjs/mapped-types';
import { CommonModel } from '../common/common';

export interface IUserModel {
  email: string;
  password: string;
}

export class UserModel extends CommonModel implements IUserModel {
  email: string;
  password: string;
}

export class CreateUserModel extends PickType(UserModel, [
  'email',
  'password',
] as const) {}
