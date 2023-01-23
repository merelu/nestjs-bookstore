import { RoleEnum } from '@domain/common/enum/role.enum';
import { IRoleModel } from '@domain/model/database/role';
import { UserModel } from '@domain/model/database/user';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
@Unique('RoleUnique', ['userId', 'role'])
export class Role implements IRoleModel {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @Column({ type: 'integer', nullable: false })
  userId: number;

  @ManyToOne(() => User, (user) => user.roles)
  user: UserModel;

  @Column({ type: 'integer', enum: RoleEnum })
  role: RoleEnum;

  @CreateDateColumn()
  createdAt!: Date;
}
