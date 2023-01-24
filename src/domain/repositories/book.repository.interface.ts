import { BookModel, CreateBookModel } from '@domain/model/database/book';
import { EntityManager } from 'typeorm';

export interface IBookRepository {
  create(data: CreateBookModel, conn?: EntityManager): Promise<BookModel>;

  findOneById(id: number, conn?: EntityManager): Promise<BookModel | null>;
}
