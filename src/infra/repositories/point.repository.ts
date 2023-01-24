import { CreatePointModel, PointModel } from '@domain/model/database/point';
import { IPointRepository } from '@domain/repositories/point.repository.interface';
import { Point } from '@infra/entities/point.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class DatabasePointRepository implements IPointRepository {
  constructor(
    @InjectRepository(Point)
    private readonly pointEntityRepository: Repository<Point>,
  ) {}

  async create(
    data: CreatePointModel,
    conn?: EntityManager | undefined,
  ): Promise<PointModel> {
    const pointEntity = this.toPointEntity(data);
    if (conn) {
      const result = await conn.getRepository(Point).save(pointEntity);
      return this.toPoint(result);
    } else {
      const result = await this.pointEntityRepository.save(pointEntity);
      return this.toPoint(result);
    }
  }

  async addPoint(
    id: number,
    point: number,
    conn?: EntityManager | undefined,
  ): Promise<void> {
    if (conn) {
      await conn.getRepository(Point).update(
        { id },
        {
          point: () => `"point" + ${point}`,
        },
      );
    } else {
      await this.pointEntityRepository.update(
        { id },
        {
          point: () => `"point" + ${point}`,
        },
      );
    }
  }

  async substractPoint(
    id: number,
    point: number,
    conn?: EntityManager | undefined,
  ): Promise<void> {
    if (conn) {
      await conn.getRepository(Point).update(
        { id },
        {
          point: () => `"point" - ${point}`,
        },
      );
    } else {
      await this.pointEntityRepository.update(
        { id },
        {
          point: () => `"point" - ${point}`,
        },
      );
    }
  }

  async softDelete(id: number): Promise<boolean> {
    const result = await this.pointEntityRepository.softDelete({ id });

    if (!result.affected) {
      return false;
    }
    return true;
  }

  private toPoint(data: Point): PointModel {
    const result = new PointModel();

    result.id = data.id;
    result.point = data.point;

    result.user = data.user;

    result.createdAt = data.createdAt;
    result.updatedAt = data.updatedAt;
    result.deletedAt = data.deletedAt;

    return result;
  }

  private toPointEntity(data: CreatePointModel): Point {
    const result = new Point();

    result.point = data.point;

    return result;
  }
}
