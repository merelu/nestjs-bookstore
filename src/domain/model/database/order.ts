import { OrderStatusEnum } from '@domain/common/enum/order-status.enum';
import { PickType } from '@nestjs/mapped-types';
import { CommonModel } from '../common/common';

export interface IOrderModel {
  id: number;
  buyer_id: number;
  orderState: OrderStatusEnum;
  usePoint: number;
  orderDate: Date;
}

export class OrderModel extends CommonModel implements IOrderModel {
  buyer_id: number;
  orderState: OrderStatusEnum;
  usePoint: number;
  orderDate: Date;
}

export class CreateOrderModel extends PickType(OrderModel, [
  'buyer_id',
  'usePoint',
  'orderDate',
] as const) {}
