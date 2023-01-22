import { PickType } from '@nestjs/mapped-types';
import { CommonModel } from '../common/common';

export interface IInventoryModel {
  id: number;
  stock: number;
  selled_stock: number;
}

export class InventoryModel extends CommonModel implements IInventoryModel {
  id: number;
  stock: number;
  selled_stock: number;
}

export class CreateInventoryModel extends PickType(InventoryModel, [
  'stock',
] as const) {}

export class UpdateInventoryModel extends PickType(InventoryModel, [
  'stock',
  'selled_stock',
] as const) {}
