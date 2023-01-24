import { AuthorModel, CreateAuthorModel } from '@domain/model/database/author';
import { EntityManager } from 'typeorm';

export interface IAuthorRepository {
  create(data: CreateAuthorModel, conn?: EntityManager): Promise<AuthorModel>;

  findOneById(id: number, conn?: EntityManager): Promise<AuthorModel | null>;
}
