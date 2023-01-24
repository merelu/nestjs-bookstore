import { OrderModel } from '@domain/model/database/order';
import { IOrderProductModel } from '@domain/model/database/order-product';
import { ProductModel } from '@domain/model/database/product';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity()
export class OrderProduct extends CommonEntity implements IOrderProductModel {
  @Column({ type: 'integer' })
  orderCount: number;

  @Column({ type: 'integer' })
  price: number;

  @Column({ type: 'integer', nullable: true })
  orderId?: number;

  @ManyToOne(() => Order, (order) => order.orderProducts)
  order?: OrderModel;

  @Column({ type: 'integer', nullable: true })
  productId?: number;

  @ManyToOne(() => Product, (product) => product.orderProducts)
  product?: ProductModel;
}
