import {
  CreateOrderProductModel,
  OrderProductModel,
} from '@domain/model/database/order-product';
import { EntityManager } from 'typeorm';

export interface IOrderProductRepository {
  create(
    data: CreateOrderProductModel,
    conn?: EntityManager,
  ): Promise<OrderProductModel>;
}
