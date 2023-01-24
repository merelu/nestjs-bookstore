import {
  AuthorBookModel,
  CreateAuthorBookModel,
} from '@domain/model/database/author-book';
import { EntityManager } from 'typeorm';

export interface IAuthorBookRepository {
  create(
    data: CreateAuthorBookModel,
    conn?: EntityManager,
  ): Promise<AuthorBookModel>;
}
