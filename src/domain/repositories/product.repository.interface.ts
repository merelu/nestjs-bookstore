import {
  CreateProductModel,
  ProductModel,
} from '@domain/model/database/product';
import { EntityManager } from 'typeorm';

export interface IProductRepository {
  create(data: CreateProductModel, conn: EntityManager): Promise<ProductModel>;

  findOneById(id: number, conn?: EntityManager): Promise<ProductModel | null>;

  findOneByIdWithDetail(
    id: number,
    conn?: EntityManager,
  ): Promise<ProductModel | null>;
}
