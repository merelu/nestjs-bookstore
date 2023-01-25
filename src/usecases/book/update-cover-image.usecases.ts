import { IException } from '@domain/adpaters/exception.interface';
import { CommonErrorCodeEnum } from '@domain/common/enum/error-code.enum';
import { ICoverImageRepository } from '@domain/repositories/cover-image.repository.interface';
import { IProductRepository } from '@domain/repositories/product.repository.interface';
import { EntityManager } from 'typeorm';

export class UpdateCoverImageUseCases {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly coverImageRepository: ICoverImageRepository,
    private readonly exceptionService: IException,
  ) {}

  async execute(
    userId: number,
    bookId: number,
    filename: string,
    dataBuffer: Buffer,
    conn: EntityManager,
  ) {
    const product = await this.checkProduct(userId, bookId);

    if (!product.book || !product.book.coverImageId) {
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '커버이미지 정보를 가져오는데 실패했습니다.',
      });
    }

    await this.updateCoverImage(
      product.book.coverImageId,
      filename,
      dataBuffer,
      conn,
    );

    const result = await this.getCoverImage(product.book.coverImageId, conn);

    return result;
  }

  private async getCoverImage(coverImageId: number, conn: EntityManager) {
    const result = await this.coverImageRepository.findOneById(
      coverImageId,
      conn,
    );

    if (!result) {
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '커버이미지 정보를 가져오는데 실패했습니다.',
      });
    }

    return result;
  }

  private async checkProduct(userId: number, bookId: number) {
    const result = await this.productRepository.findOneByQueryWithRelation(
      { bookId: bookId },
      {
        book: true,
      },
    );

    if (!result) {
      throw this.exceptionService.badRequestException({
        error_code: CommonErrorCodeEnum.INVALID_PARAM,
        error_text: '잘못된 id 입니다.',
      });
    }

    if (!result.sellerId || result.sellerId !== userId) {
      throw this.exceptionService.forbiddenException({
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
        error_text: '수정 권한이 없습니다.',
      });
    }

    return result;
  }

  private async updateCoverImage(
    coverImageId: number,
    filename: string,
    data: Buffer,
    conn: EntityManager,
  ) {
    try {
      await this.coverImageRepository.updateImageData(
        coverImageId,
        filename,
        data,
        conn,
      );
    } catch (err) {
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '이미지를 업데이트 실패.',
      });
    }
  }
}
