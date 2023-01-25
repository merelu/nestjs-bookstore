import { RoleEnum } from '@domain/common/enum/role.enum';
import {
  IUserModelWithoutPassword,
  UserModelWithoutPassword,
} from '@domain/model/database/user';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class BaseUserPresenter implements IUserModelWithoutPassword {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  zipCode: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  role: RoleEnum;

  constructor(data: UserModelWithoutPassword) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.zipCode = data.zipCode;
    this.address = data.address;
    this.role = data.role;
  }
}

export class SellerPresenter extends PickType(BaseUserPresenter, [
  'id',
  'name',
]) {
  constructor(data: UserModelWithoutPassword) {
    super(data);
    this.id = data.id;
    this.name = data.name;
  }
}

export class BuyerPresenter extends PickType(BaseUserPresenter, [
  'id',
  'name',
  'email',
  'zipCode',
  'address',
]) {
  constructor(data: UserModelWithoutPassword) {
    super(data);
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.zipCode = data.zipCode;
    this.address = data.address;
  }
}
