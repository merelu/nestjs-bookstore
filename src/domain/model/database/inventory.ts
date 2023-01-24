import { PickType } from '@nestjs/mapped-types';
import { CommonModel } from '../common/common';
import { ProductModel } from './product';

export interface IInventoryModel {
  id: number;
  stock: number;
  selledStock: number;
}

export class InventoryModel extends CommonModel implements IInventoryModel {
  id: number;
  stock: number;
  selledStock: number;
  product?: ProductModel;
}

export class CreateInventoryModel extends PickType(InventoryModel, [
  'stock',
] as const) {}

export class UpdateInventoryModel extends PickType(InventoryModel, [
  'stock',
  'selledStock',
] as const) {}
