import { PointModel } from '@domain/model/database/point';
import { RoleModel } from '@domain/model/database/role';
import { IUserModel } from '@domain/model/database/user';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Point } from './point.entity';
import { Role } from './role.entity';

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

  @OneToMany(() => Role, (role) => role.userId)
  roles: RoleModel[];

  @OneToOne(() => Point, (point) => point.user)
  point: PointModel;
}
