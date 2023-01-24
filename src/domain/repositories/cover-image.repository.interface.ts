import {
  CoverImageModel,
  CreateCoverImageModel,
} from '@domain/model/database/cover-image';
import { EntityManager } from 'typeorm';

export interface ICoverImageRepository {
  create(
    data: CreateCoverImageModel,
    conn: EntityManager,
  ): Promise<CoverImageModel>;

  findOneById(id: number): Promise<CoverImageModel | null>;
}
