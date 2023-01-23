import { IFormatExceptionMessage } from '@domain/adpaters/exception.interface';
import { CommonErrorCodeEnum } from '@domain/common/enum/error-code.enum';
import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const createValidationException = (errors: ValidationError[]) => {
  const message = errors
    .map((i) => Object.values(i.constraints || {}))
    .flat()
    .join(', ');

  return new BadRequestException({
    error_code: CommonErrorCodeEnum.INVALID_PARAM,
    error_text: message,
  } as IFormatExceptionMessage);
};
