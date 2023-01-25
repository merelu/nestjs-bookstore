import { IException } from '@domain/adpaters/exception.interface';
import { CommonErrorCodeEnum } from '@domain/common/enum/error-code.enum';
import { IProductRepository } from '@domain/repositories/product.repository.interface';

export class CheckInventoryUseCases {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly exceptionService: IException,
  ) {}

  async execute(userId: number, productId: number) {
    return await this.checkProduct(userId, productId);
  }

  private async checkProduct(userId: number, productId: number) {
    const result = await this.productRepository.findOneByIdWithRelation(
      productId,
      {
        inventory: true,
      },
    );

    if (!result) {
      throw this.exceptionService.badRequestException({
        error_code: CommonErrorCodeEnum.INVALID_PARAM,
        error_text: 'id에 해당하는 데이터가 없습니다.',
      });
    }

    if (result.sellerId && result.sellerId !== userId) {
      throw this.exceptionService.forbiddenException({
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
        error_text: '확인 권한이 없습니다.',
      });
    }

    return result;
  }
}
