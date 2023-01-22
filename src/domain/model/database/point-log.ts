import { PickType } from '@nestjs/swagger';
import { CommonModel } from '../common/common';

export interface IPointLogModel {
  id: number;
  pointId: number;
  point: number;
  usePoint: number;
  content: string;
  action: string;
}

export class PointLogModel extends CommonModel implements IPointLogModel {
  pointId: number;
  point: number;
  usePoint: number;
  content: string;
  action: string;
}

export class CreatePointLogModel extends PickType(PointLogModel, [
  'pointId',
  'point',
  'usePoint',
  'content',
  'action',
]) {}
