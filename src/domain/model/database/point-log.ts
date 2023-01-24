import { PointLogActionEnum } from '@domain/common/enum/point-log-action.enum';
import { PickType } from '@nestjs/swagger';
import { CommonModel } from '../common/common';
import { PointModel } from './point';

export interface IPointLogModel {
  id: number;

  addPoint: number;
  usePoint: number;
  content: string;
  action: PointLogActionEnum;

  pointId?: number;
}

export class PointLogModel extends CommonModel implements IPointLogModel {
  addPoint: number;
  usePoint: number;
  content: string;
  action: PointLogActionEnum;

  pointId?: number;
  point?: PointModel;
}

export class CreatePointLogModel extends PickType(PointLogModel, [
  'pointId',
  'addPoint',
  'usePoint',
  'content',
  'action',
]) {}
