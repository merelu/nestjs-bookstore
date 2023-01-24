import { BookModel } from '@domain/model/database/book';
import { InventoryModel } from '@domain/model/database/inventory';
import { IProductModel } from '@domain/model/database/product';
import { UserModel } from '@domain/model/database/user';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Book } from './book.entity';
import { CommonEntity } from './common.entity';
import { Inventory } from './inventory.entity';
import { User } from './user.entity';

@Entity()
export class Product extends CommonEntity implements IProductModel {
  @Column({ type: 'integer', nullable: false })
  price: number;

  @Column({ type: 'integer', nullable: true })
  sellerId?: number;

  @ManyToOne(() => User, (user) => user.products, { nullable: true })
  @JoinColumn({ name: 'seller_id' })
  seller?: UserModel;

  @Column({ type: 'integer', nullable: true })
  bookId?: number;

  @OneToOne(() => Book, (book) => book.product, { nullable: true })
  @JoinColumn({ name: 'book_id' })
  book?: BookModel;

  @Column({ type: 'integer', nullable: true })
  inventoryId?: number;

  @OneToOne(() => Inventory, (inventory) => inventory.product, {
    nullable: true,
  })
  @JoinColumn({ name: 'inventory_id' })
  inventory?: InventoryModel;
}
