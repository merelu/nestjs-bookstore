import { CommonErrorCodeEnum } from '@domain/common/enum/error-code.enum';
import { IFormatExceptionMessage } from '@domain/model/common/exception';
import { ApiProperty } from '@nestjs/swagger';

export class FormatException implements IFormatExceptionMessage {
  @ApiProperty()
  error_code: CommonErrorCodeEnum;

  @ApiProperty()
  error_text: string;
}
