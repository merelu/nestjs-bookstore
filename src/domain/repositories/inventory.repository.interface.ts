import {
  CreateInventoryModel,
  InventoryModel,
} from '@domain/model/database/inventory';

import { EntityManager } from 'typeorm';

export interface IInventoryRepository {
  create(
    data: CreateInventoryModel,
    conn: EntityManager,
  ): Promise<InventoryModel>;

  findOneById(id: number, conn?: EntityManager): Promise<InventoryModel | null>;

  addStock(id: number, stock: number, conn?: EntityManager): Promise<void>;

  substractStock(
    id: number,
    stock: number,
    conn?: EntityManager,
  ): Promise<void>;

  addSelledStock(
    id: number,
    stock: number,
    conn?: EntityManager,
  ): Promise<void>;

  substractSelledStock(
    id: number,
    stock: number,
    conn?: EntityManager,
  ): Promise<void>;
}
