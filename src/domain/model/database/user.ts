import { RoleEnum } from '@domain/common/enum/role.enum';
import { OmitType, PickType } from '@nestjs/mapped-types';
import { CommonModel } from '../common/common';
import { OrderModel } from './order';
import { PointModel } from './point';
import { ProductModel } from './product';
export interface IUserModelWithoutPassword {
  id: number;
  name: string;
  email: string;
  zipCode: string;
  address: string;
  role: RoleEnum;
  pointId?: number;
}
export interface IUserModel extends IUserModelWithoutPassword {
  password: string;
}

export class UserModel extends CommonModel implements IUserModel {
  zipCode: string;
  address: string;
  name: string;
  email: string;
  password: string;
  role: RoleEnum;
  pointId?: number;
  point?: PointModel;
  products?: ProductModel[];
  orders?: OrderModel[];
}

export class UserModelWithoutPassword extends OmitType(UserModel, [
  'password',
] as const) {}

export class CreateUserModel extends PickType(UserModel, [
  'name',
  'email',
  'zipCode',
  'address',
  'password',
  'role',
  'pointId',
] as const) {}

export class UpdateUserModel extends PickType(CreateUserModel, [
  'name',
  'address',
  'zipCode',
  'password',
] as const) {}
