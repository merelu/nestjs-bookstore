import {
  CreatePointLogModel,
  PointLogModel,
} from '@domain/model/database/point-log';
import { EntityManager } from 'typeorm';

export interface IPointLogRepository {
  create(
    data: CreatePointLogModel,
    conn?: EntityManager,
  ): Promise<PointLogModel>;
}
