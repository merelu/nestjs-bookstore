import { CommonErrorCodeEnum } from '@domain/common/enum/error-code.enum';
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException({
        error_code: CommonErrorCodeEnum.INVALID_PARAM,
        error_text: 'Validation failed (numeric string is expected)',
      });
    }
    return val;
  }
}
