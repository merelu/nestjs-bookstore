import { IException } from '@domain/adpaters/exception.interface';
import { CommonErrorCodeEnum } from '@domain/common/enum/error-code.enum';
import { ICoverImageRepository } from '@domain/repositories/cover-image.repository.interface';

export class GetCoverImageUseCases {
  constructor(
    private readonly coverImageRepository: ICoverImageRepository,
    private readonly exceptionService: IException,
  ) {}

  async execute(id: number) {
    const result = await this.coverImageRepository.findOneById(id);

    if (!result) {
      throw this.exceptionService.badRequestException({
        error_code: CommonErrorCodeEnum.INVALID_PARAM,
        error_text: 'id에 해당하는 이미지가 없습니다.',
      });
    }

    return result;
  }
}
