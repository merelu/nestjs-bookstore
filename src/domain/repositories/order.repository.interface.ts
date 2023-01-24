import { CreateOrderModel, OrderModel } from '@domain/model/database/order';
import { EntityManager } from 'typeorm';

export interface IOrderRepository {
  create(data: CreateOrderModel, conn?: EntityManager): Promise<OrderModel>;

  findOneDetailById(
    id: number,
    conn?: EntityManager,
  ): Promise<OrderModel | null>;
}
