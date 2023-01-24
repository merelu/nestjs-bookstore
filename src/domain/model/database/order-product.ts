import { PickType } from '@nestjs/mapped-types';
import { CommonModel } from '../common/common';
import { OrderModel } from './order';
import { ProductModel } from './product';

export interface IOrderProductModel {
  id: number;
  orderId?: number;
  productId?: number;
  orderCount: number;
  price: number;
}

export class OrderProductModel
  extends CommonModel
  implements IOrderProductModel
{
  orderId?: number;
  order?: OrderModel;
  productId?: number;
  product?: ProductModel;
  orderCount: number;
  price: number;
}

export class CreateOrderProductModel extends PickType(OrderProductModel, [
  'orderId',
  'productId',
  'orderCount',
  'price',
] as const) {}
