import { CommonErrorCodeEnum } from '@domain/common/enum/error-code.enum';
import { HttpException } from '@nestjs/common';

export interface IFormatExceptionMessage {
  error_code: CommonErrorCodeEnum;
  error_text?: string;
}

export interface IException {
  badRequestException(data: IFormatExceptionMessage): HttpException;
  notFoundException(data: IFormatExceptionMessage): HttpException;
  internalServerErrorException(data?: IFormatExceptionMessage): HttpException;
  forbiddenException(data?: IFormatExceptionMessage): HttpException;
  unauthorizedException(data?: IFormatExceptionMessage): HttpException;
}
