import {
  IInventoryModel,
  InventoryModel,
} from '@domain/model/database/inventory';
import { ApiProperty } from '@nestjs/swagger';

export class InventoryPresenter implements IInventoryModel {
  @ApiProperty()
  id: number;
  @ApiProperty()
  stock: number;

  @ApiProperty()
  selledStock: number;

  constructor(data: InventoryModel) {
    this.id = data.id;
    this.stock = data.stock;
    this.selledStock = data.selledStock;
  }
}
