import { RoleEnum } from '@domain/common/enum/role.enum';
import { IRoleModel } from '@domain/model/database/role';
import { UserModel } from '@domain/model/database/user';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { User } from './user.entity';

@Entity()
export class Role extends CommonEntity implements IRoleModel {
  @Column({ type: 'integer', nullable: false })
  userId: number;

  @ManyToOne(() => User, (user) => user.roles)
  user: UserModel;

  @Column({})
  role: RoleEnum;
}
