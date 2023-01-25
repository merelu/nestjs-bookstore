import { OrderStateEnum } from '@domain/common/enum/order-state.enum';
import { PickType } from '@nestjs/mapped-types';
import { CommonModel } from '../common/common';
import { OrderProductModel } from './order-product';
import { UserModel } from './user';

export interface IOrderModel {
  id: number;
  buyerId?: number;
  orderState: OrderStateEnum;
  usePoint: number;
  orderDate: Date;
}

export class OrderModel extends CommonModel implements IOrderModel {
  buyerId?: number;
  buyer?: UserModel;
  orderState: OrderStateEnum;
  usePoint: number;
  orderDate: Date;
  orderProducts?: OrderProductModel[];
}

export class CreateOrderModel extends PickType(OrderModel, [
  'buyerId',
  'usePoint',
  'orderDate',
] as const) {}
