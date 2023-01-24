import { RoleEnum } from '@domain/common/enum/role.enum';
import { PointModel } from '@domain/model/database/point';
import { ProductModel } from '@domain/model/database/product';
import { IUserModel } from '@domain/model/database/user';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Point } from './point.entity';
import { Product } from './product.entity';

@Entity()
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
}
