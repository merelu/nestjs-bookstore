import { OrderStateEnum } from '@domain/common/enum/order-state.enum';
import { CreateOrderModel, OrderModel } from '@domain/model/database/order';
import { EntityManager } from 'typeorm';

export interface IOrderRepository {
  create(data: CreateOrderModel, conn?: EntityManager): Promise<OrderModel>;

  findOneById(id: number): Promise<OrderModel | null>;

  findOneDetailById(
    id: number,
    conn?: EntityManager,
  ): Promise<OrderModel | null>;

  findByBuyerId(buyerId: number): Promise<OrderModel[]>;

  updateOrderState(
    id: number,
    orderState: OrderStateEnum,
    conn?: EntityManager,
  ): Promise<void>;
}
