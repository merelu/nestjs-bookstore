import { PickType } from '@nestjs/mapped-types';
import { CommonModel } from '../common/common';
import { BookModel } from './book';
import { InventoryModel } from './inventory';
import { UserModel } from './user';

export interface IProductModel {
  id: number;
  bookId?: number;
  price: number;
  inventoryId?: number;
  sellerId?: number;
}

export class ProductModel extends CommonModel implements IProductModel {
  inventoryId?: number;
  inventory?: InventoryModel;
  bookId?: number;
  book?: BookModel;
  sellerId?: number;
  seller?: UserModel;
  price: number;
}

export class CreateProductModel extends PickType(ProductModel, [
  'price',
  'bookId',
  'inventoryId',
  'sellerId',
] as const) {}

export class UpdateProductModel extends PickType(CreateProductModel, [
  'price',
] as const) {}
