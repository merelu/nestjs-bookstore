import {
  DEFAULT_PAGINATION_PAGE,
  DEFAULT_PAGINATION_SIZE,
} from '@domain/common/constants/default.pagination';
import { IPagination } from '@domain/model/common/pagination';
import { IProductRepository } from '@domain/repositories/product.repository.interface';
import dayjs from 'dayjs';

export class GetProductsUseCases {
  constructor(private readonly productRepository: IProductRepository) {}

  async getProductsWithPagination(pagination: IPagination) {
    const page = pagination.page ? pagination.page : DEFAULT_PAGINATION_PAGE;
    const size = pagination.size ? pagination.size : DEFAULT_PAGINATION_SIZE;
    const requestedAt = pagination.requestedAt
      ? pagination.requestedAt
      : dayjs().toDate();
    return await this.productRepository.findDetailWithPagination(
      page,
      size,
      requestedAt,
    );
  }
}
