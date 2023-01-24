import { IPointModel } from '@domain/model/database/point';
import { UserModel } from '@domain/model/database/user';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { PointLog } from './point-log.entity';
import { User } from './user.entity';

@Entity()
export class Point extends CommonEntity implements IPointModel {
  @OneToOne(() => User, (user) => user.point, { nullable: true })
  user?: UserModel;

  @Column({ type: 'integer', default: 0 })
  point: number;

  @OneToMany(() => PointLog, (pointLog) => pointLog.point, { nullable: true })
  pointLogs?: PointLog[];
}
