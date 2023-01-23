import { IPointModel } from '@domain/model/database/point';
import { UserModel } from '@domain/model/database/user';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { PointLog } from './point-log.entity';
import { User } from './user.entity';

@Entity()
export class Point extends CommonEntity implements IPointModel {
  @Column({ type: 'integer', nullable: false, primary: true })
  userId: number;

  @OneToOne(() => User, (user) => user.point)
  @JoinColumn({ name: 'user_id' })
  user: UserModel;

  @Column({ type: 'integer' })
  point: number;

  @OneToMany(() => PointLog, (pointLog) => pointLog.point)
  pointLogs: PointLog[];
}
