import { RoleEnum } from '@domain/common/enum/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class SignupDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{5,}$/, {
    message:
      '문자, 숫자, 특수문자가 포함된 5자리 이상의 패스워드를 작성 해주세요',
  })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty()
  @IsString()
  @Length(1, 10)
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @Matches(/\d{5}/, { message: 'Not enabled zipcode' })
  @IsNotEmpty()
  readonly zipCode: string;

  @ApiProperty()
  @IsString()
  @Length(1, 255)
  @IsNotEmpty()
  readonly address: string;

  @ApiProperty({ isArray: true, type: 'number' })
  @IsEnum(RoleEnum, { each: true })
  @ArrayUnique()
  @ArrayNotEmpty()
  readonly roles: RoleEnum[];
}
