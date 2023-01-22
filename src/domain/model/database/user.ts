import { PickType } from '@nestjs/mapped-types';
import { CommonModel } from '../common/common';

export interface IUserModel {
  id: number;
  name: string;
  email: string;
  password: string;
}

export class UserModel extends CommonModel implements IUserModel {
  name: string;
  email: string;
  password: string;
}

export class CreateUserModel extends PickType(UserModel, [
  'name',
  'email',
  'password',
] as const) {}

export class UpdateUserModel extends PickType(CreateUserModel, [
  'name',
  'password',
] as const) {}
