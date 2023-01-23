import { CommonErrorCodeEnum } from '@domain/common/enum/error-code.enum';

export interface IFormatExceptionMessage {
  error_code: CommonErrorCodeEnum;
  error_text?: string;
}
