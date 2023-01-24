import { CreateAuthorModel, AuthorModel } from '@domain/model/database/author';
import { IAuthorRepository } from '@domain/repositories/author.repository.inteface';
import { Author } from '@infra/entities/author.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class DatabaseAuthorRepository implements IAuthorRepository {
  constructor(
    @InjectRepository(Author)
    private readonly authorEntityRepository: Repository<Author>,
  ) {}
  async create(
    data: CreateAuthorModel,
    conn?: EntityManager | undefined,
  ): Promise<AuthorModel> {
    const authorEntity = this.toAuthorEntity(data);
    if (conn) {
      const result = await conn.getRepository(Author).save(authorEntity);
      return this.toAuthor(result);
    } else {
      const result = await this.authorEntityRepository.save(authorEntity);
      return this.toAuthor(result);
    }
  }
  async findOneById(
    id: number,
    conn?: EntityManager,
  ): Promise<AuthorModel | null> {
    let result: Author | null = null;

    if (conn) {
      result = await conn.getRepository(Author).findOne({ where: { id } });
    } else {
      result = await this.authorEntityRepository.findOne({ where: { id } });
    }
    if (!result) {
      return null;
    }

    return this.toAuthor(result);
  }

  private toAuthor(data: Author): AuthorModel {
    const result = new AuthorModel();
    result.id = data.id;
    result.name = data.name;
    result.authorBooks = data.authorBooks;
    result.createdAt = data.createdAt;
    result.updatedAt = data.updatedAt;
    result.deletedAt = data.deletedAt;
    return result;
  }

  private toAuthorEntity(data: CreateAuthorModel): Author {
    const result = new Author();
    result.name = data.name;
    return result;
  }
}
