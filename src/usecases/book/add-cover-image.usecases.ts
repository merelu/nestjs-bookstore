import { IException } from '@domain/adpaters/exception.interface';
import { CommonErrorCodeEnum } from '@domain/common/enum/error-code.enum';
import { IUrlConfig } from '@domain/config/url-config.interface';
import { CreateCoverImageModel } from '@domain/model/database/cover-image';
import { ICoverImageRepository } from '@domain/repositories/cover-image.repository.interface';
import { EntityManager } from 'typeorm';

export class AddCoverImageUseCases {
  constructor(
    private readonly coverImageRepository: ICoverImageRepository,
    private readonly exceptionService: IException,
    private readonly config: IUrlConfig,
  ) {}

  async execute(
    userId: number,
    filename: string,
    dataBuffer: Buffer,
    conn: EntityManager,
  ) {
    const newCover = new CreateCoverImageModel();
    newCover.uploaderId = userId;
    newCover.filename = filename;
    newCover.data = dataBuffer;
    newCover.url = `${this.config.getBaseUrl()}/book/cover`;
    try {
      const result = await this.coverImageRepository.create(newCover, conn);
      return result;
    } catch (err) {
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '커버 이미지 업로드 실패',
      });
    }
  }
}
