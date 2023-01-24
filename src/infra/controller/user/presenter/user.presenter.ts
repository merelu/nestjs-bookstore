import { RoleEnum } from '@domain/common/enum/role.enum';
import {
  IUserModelWithoutPassword,
  UserModelWithoutPassword,
} from '@domain/model/database/user';
import { ApiProperty } from '@nestjs/swagger';

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
