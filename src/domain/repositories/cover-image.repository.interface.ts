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

  findOneByIdWithoutData(
    id: number,
    conn?: EntityManager,
  ): Promise<CoverImageModel | null>;

  findOneById(
    id: number,
    conn?: EntityManager,
  ): Promise<CoverImageModel | null>;

  updateImageData(
    id: number,
    filename: string,
    data: Uint8Array,
    conn?: EntityManager,
  ): Promise<void>;
}
