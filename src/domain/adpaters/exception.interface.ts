import { IFormatExceptionMessage } from '@domain/model/common/exception';
import { HttpException } from '@nestjs/common';

export interface IException {
  badRequestException(data: IFormatExceptionMessage): HttpException;
  notFoundException(data: IFormatExceptionMessage): HttpException;
  internalServerErrorException(data?: IFormatExceptionMessage): HttpException;
  forbiddenException(data?: IFormatExceptionMessage): HttpException;
  unauthorizedException(data?: IFormatExceptionMessage): HttpException;
}
