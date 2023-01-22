import { PickType } from '@nestjs/mapped-types';
import { CommonModel } from '../common/common';

export interface IProductModel {
  id: number;
  bookId: number;
  price: number;
}

export class ProductModel extends CommonModel implements IProductModel {
  bookId: number;
  price: number;
}

export class CreateProductModel extends PickType(ProductModel, [
  'price',
  'bookId',
] as const) {}

export class UpdateProductModel extends PickType(CreateProductModel, [
  'price',
] as const) {}
