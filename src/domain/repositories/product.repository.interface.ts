import { IPagination } from '@domain/model/common/pagination';
import {
  CreateProductModel,
  ProductModel,
} from '@domain/model/database/product';
import { EntityManager, FindOptionsRelations, FindOptionsWhere } from 'typeorm';

export interface IProductRepository {
  create(data: CreateProductModel, conn: EntityManager): Promise<ProductModel>;

  findOneById(id: number, conn?: EntityManager): Promise<ProductModel | null>;

  findOneByIdWithDetail(
    id: number,
    conn?: EntityManager,
  ): Promise<ProductModel | null>;

  findDetailWithPagination(
    page: number,
    size: number,
    requestedAt: Date,
  ): Promise<ProductModel[]>;

  findOneByIdWithRelation(
    id: number,
    relations: FindOptionsRelations<ProductModel>,
  ): Promise<ProductModel | null>;

  findOneByQueryWithRelation(
    query: FindOptionsWhere<ProductModel>,
    relations: FindOptionsRelations<ProductModel>,
  ): Promise<ProductModel | null>;
}
