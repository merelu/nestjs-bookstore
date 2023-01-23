import { PickType } from '@nestjs/mapped-types';
import { CommonModel } from '../common/common';
import { PointModel } from './point';
import { RoleModel } from './role';

export interface IUserModel {
  id: number;
  name: string;
  email: string;
  zipCode: string;
  address: string;
  password: string;
}

export class UserModel extends CommonModel implements IUserModel {
  zipCode: string;
  address: string;
  name: string;
  email: string;
  password: string;

  roles: RoleModel[];
  point: PointModel;
}

export class CreateUserModel extends PickType(UserModel, [
  'name',
  'email',
  'zipCode',
  'address',
  'password',
] as const) {}

export class UpdateUserModel extends PickType(CreateUserModel, [
  'name',
  'address',
  'zipCode',
  'password',
] as const) {}
