import { PointLog } from '@infra/entities/point-log.entity';
import { PickType } from '@nestjs/mapped-types';
import { CommonModel } from '../common/common';
import { UserModel } from './user';

export interface IPointModel {
  id: number;
  point: number;
}

export class PointModel extends CommonModel implements IPointModel {
  user?: UserModel;
  point: number;
  pointLogs?: PointLog[];
}

export class CreatePointModel extends PickType(PointModel, [
  'point',
] as const) {}

export class UpdatePointModel extends PickType(PointModel, [
  'point',
] as const) {}
