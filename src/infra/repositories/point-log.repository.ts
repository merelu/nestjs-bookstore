import {
  CreatePointLogModel,
  PointLogModel,
} from '@domain/model/database/point-log';
import { IPointLogRepository } from '@domain/repositories/point-log.repository.interface';
import { PointLog } from '@infra/entities/point-log.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class DatabasePointLogRepository implements IPointLogRepository {
  constructor(
    @InjectRepository(PointLog)
    private readonly pointLogEntityRepository: Repository<PointLog>,
  ) {}

  async create(
    data: CreatePointLogModel,
    conn?: EntityManager | undefined,
  ): Promise<PointLogModel> {
    const pointLogEntity = this.toPointLogEntity(data);
    if (conn) {
      const result = await conn.getRepository(PointLog).save(pointLogEntity);
      return this.toPointLog(result);
    } else {
      const result = await this.pointLogEntityRepository.save(pointLogEntity);
      return this.toPointLog(result);
    }
  }

  private toPointLog(data: PointLog): PointLogModel {
    const result = new PointLogModel();

    result.id = data.id;
    result.content = data.content;
    result.action = data.action;
    result.addPoint = data.addPoint;
    result.usePoint = data.usePoint;
    result.pointId = data.pointId;
    result.point = data.point;

    result.createdAt = data.createdAt;
    result.updatedAt = data.updatedAt;
    result.deletedAt = data.deletedAt;

    return result;
  }

  private toPointLogEntity(data: CreatePointLogModel): PointLog {
    const result = new PointLog();
    result.pointId = data.pointId;
    result.content = data.content;
    result.action = data.action;
    result.addPoint = data.addPoint;
    result.usePoint = data.usePoint;

    return result;
  }
}
