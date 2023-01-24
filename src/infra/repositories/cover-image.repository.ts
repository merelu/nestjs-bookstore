import {
  CreateCoverImageModel,
  CoverImageModel,
} from '@domain/model/database/cover-image';
import { ICoverImageRepository } from '@domain/repositories/cover-image.repository.interface';
import { CoverImage } from '@infra/entities/cover-image.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class DatabaseCoverImageRepository implements ICoverImageRepository {
  constructor(
    @InjectRepository(CoverImage)
    private readonly coverImageEntityRepository: Repository<CoverImage>,
  ) {}
  async findOneById(id: number): Promise<CoverImageModel | null> {
    const result = await this.coverImageEntityRepository.findOne({
      where: { id },
    });

    if (!result) {
      return null;
    }

    return this.toCoverIamge(result);
  }

  async create(
    data: CreateCoverImageModel,
    conn: EntityManager,
  ): Promise<CoverImageModel> {
    const coverIamgeEntity = this.toCoverImageEntity(data);
    const coverImage = await conn
      .getRepository(CoverImage)
      .save(coverIamgeEntity);
    coverImage.url = data.url + `/${coverImage.id}`;
    const result = await conn.getRepository(CoverImage).save(coverImage);
    return this.toCoverIamge(result);
  }

  private toCoverIamge(data: CoverImage): CoverImageModel {
    const result = new CoverImageModel();
    result.id = data.id;
    result.filename = data.filename;
    result.data = data.data;
    result.url = data.url;
    result.createdAt = data.createdAt;
    result.updatedAt = data.updatedAt;
    result.deletedAt = data.deletedAt;

    return result;
  }

  private toCoverImageEntity(data: CreateCoverImageModel): CoverImage {
    const result = new CoverImage();
    result.filename = data.filename;
    result.data = data.data;

    return result;
  }
}
