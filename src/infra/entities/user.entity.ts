import { RoleEnum } from '@domain/common/enum/role.enum';
import { CoverImageModel } from '@domain/model/database/cover-image';
import { OrderModel } from '@domain/model/database/order';
import { PointModel } from '@domain/model/database/point';
import { ProductModel } from '@domain/model/database/product';
import { IUserModel } from '@domain/model/database/user';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { CommonEntity } from './common.entity';
import { CoverImage } from './cover-image.entity';
import { Order } from './order.entity';
import { Point } from './point.entity';
import { Product } from './product.entity';

@Entity()
@Index('User_PointId', ['pointId'], {})
export class User extends CommonEntity implements IUserModel {
  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  zipCode: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.CUSTOMER })
  role: RoleEnum;

  @Column({ type: 'integer', nullable: true })
  pointId?: number;

  @OneToOne(() => Point, (point) => point.user, { nullable: true })
  @JoinColumn({ name: 'point_id' })
  point?: PointModel;

  @OneToMany(() => Product, (product) => product.seller)
  products: ProductModel[];

  @OneToMany(() => Order, (order) => order.buyer, { nullable: true })
  orders?: OrderModel[];

  @OneToMany(() => CoverImage, (coverImage) => coverImage.uploader, {
    nullable: true,
  })
  coverImages?: CoverImageModel[];
}
