import { PickType } from '@nestjs/mapped-types';
import { CommonModel } from '../common/common';

export interface IOrderItemModel {
  id: number;
  orderId: number;
  productId: number;
  orderCount: number;
  price: number;
}

export class OrderItemModel extends CommonModel implements IOrderItemModel {
  orderId: number;
  productId: number;
  orderCount: number;
  price: number;
}

export class CreateOrderItemModel extends PickType(OrderItemModel, [
  'orderId',
  'productId',
  'orderCount',
  'price',
] as const) {}
