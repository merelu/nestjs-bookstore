import { CreatePointModel, PointModel } from '@domain/model/database/point';
import { EntityManager } from 'typeorm';

export interface IPointRepository {
  create(data: CreatePointModel, conn?: EntityManager): Promise<PointModel>;

  addPoint(id: number, point: number, conn?: EntityManager): Promise<void>;

  findOneById(id: number): Promise<PointModel | null>;

  substractPoint(
    id: number,
    point: number,
    conn?: EntityManager,
  ): Promise<void>;

  softDelete(id: number): Promise<boolean>;
}
