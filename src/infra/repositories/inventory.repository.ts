import {
  CreateInventoryModel,
  InventoryModel,
} from '@domain/model/database/inventory';
import { IInventoryRepository } from '@domain/repositories/inventory.repository.interface';
import { Inventory } from '@infra/entities/inventory.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class DatabaseInventoryRepository implements IInventoryRepository {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryEntityRepository: Repository<Inventory>,
  ) {}
  async create(
    data: CreateInventoryModel,
    conn: EntityManager,
  ): Promise<InventoryModel> {
    const inventoryEntity = this.toInventoryEntity(data);
    if (conn) {
      const result = await conn.getRepository(Inventory).save(inventoryEntity);
      return this.toInventory(result);
    } else {
      const result = await this.inventoryEntityRepository.save(inventoryEntity);
      return this.toInventory(result);
    }
  }
  async findOneById(
    id: number,
    conn?: EntityManager | undefined,
  ): Promise<InventoryModel | null> {
    let result: Inventory | null = null;

    if (conn) {
      result = await conn.getRepository(Inventory).findOne({ where: { id } });
    } else {
      result = await this.inventoryEntityRepository.findOne({ where: { id } });
    }
    if (!result) {
      return null;
    }

    return this.toInventory(result);
  }

  private toInventory(data: Inventory): InventoryModel {
    const result = new InventoryModel();

    result.id = data.id;
    result.stock = data.stock;
    result.selledStock = data.selledStock;
    result.product = data.product;
    result.createdAt = data.createdAt;
    result.updatedAt = data.updatedAt;
    result.deletedAt = data.deletedAt;

    return result;
  }

  private toInventoryEntity(data: CreateInventoryModel): Inventory {
    const result = new Inventory();

    result.stock = data.stock;

    return result;
  }
}
