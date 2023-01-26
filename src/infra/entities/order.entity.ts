import { OrderStateEnum } from '@domain/common/enum/order-state.enum';
import { IOrderModel } from '@domain/model/database/order';
import { OrderProductModel } from '@domain/model/database/order-product';
import { UserModel } from '@domain/model/database/user';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CommonEntity } from './common.entity';
import { OrderProduct } from './order-product.entity';
import { User } from './user.entity';

@Entity()
@Index('Order_buyer_id', ['buyerId'], {})
export class Order extends CommonEntity implements IOrderModel {
  @Column({
    type: 'enum',
    enum: OrderStateEnum,
    default: OrderStateEnum.ORDER,
  })
  orderState: OrderStateEnum;

  @Column({ type: 'integer' })
  usePoint: number;

  @Column({ type: 'timestamp' })
  orderDate: Date;

  @Column({ type: 'integer', nullable: true })
  buyerId?: number;

  @ManyToOne(() => User, (user) => user.orders, { nullable: true })
  @JoinColumn({ name: 'buyer_id' })
  buyer?: UserModel;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  orderProducts?: OrderProductModel[];
}
