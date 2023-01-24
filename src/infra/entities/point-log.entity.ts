import { PointLogActionEnum } from '@domain/common/enum/point-log-action.enum';
import { PointModel } from '@domain/model/database/point';
import { IPointLogModel } from '@domain/model/database/point-log';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Point } from './point.entity';

@Entity()
export class PointLog extends CommonEntity implements IPointLogModel {
  @Column({ type: 'integer', nullable: true })
  pointId?: number;

  @ManyToOne(() => Point, (point) => point.pointLogs, { nullable: true })
  point?: PointModel;

  @Column({ type: 'integer' })
  usePoint: number;

  @Column({ type: 'integer' })
  addPoint: number;

  @Column({ type: 'varchar' })
  content: string;

  @Column({ type: 'enum', enum: PointLogActionEnum })
  action: PointLogActionEnum;
}
