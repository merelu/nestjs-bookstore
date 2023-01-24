import { IInventoryModel } from '@domain/model/database/inventory';
import { ProductModel } from '@domain/model/database/product';
import { Column, Entity, OneToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Product } from './product.entity';

@Entity()
export class Inventory extends CommonEntity implements IInventoryModel {
  @Column({ type: 'integer', nullable: false })
  stock: number;

  @Column({ type: 'integer', default: 0 })
  selledStock: number;

  @OneToOne(() => Product, (product) => product.inventory, { nullable: true })
  product?: ProductModel;
}
