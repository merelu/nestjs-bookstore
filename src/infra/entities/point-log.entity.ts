import { IPointModel, PointModel } from '@domain/model/database/point';
import { IPointLogModel } from '@domain/model/database/point-log';

import { Column, Entity, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Point } from './point.entity';

@Entity()
export class PointLog extends CommonEntity implements IPointLogModel {
  @Column({ type: 'integer', nullable: false })
  pointId: number;

  @ManyToOne(() => Point, (point) => point.pointLogs)
  point: PointModel;

  @Column({ type: 'integer' })
  usePoint: number;

  @Column({ type: 'integer' })
  addPoint: number;

  @Column({ type: 'varchar' })
  content: string;

  @Column({ type: 'varchar' })
  action: string;
}
