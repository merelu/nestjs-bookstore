import {
  CreateAuthorBookModel,
  AuthorBookModel,
} from '@domain/model/database/author-book';
import { IAuthorBookRepository } from '@domain/repositories/author-book.repository.interface';
import { AuthorBook } from '@infra/entities/author-book.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class DatabaseAuthorBookRepository implements IAuthorBookRepository {
  constructor(
    @InjectRepository(AuthorBook)
    private readonly authorBookEntityRepository: Repository<AuthorBook>,
  ) {}

  async create(
    data: CreateAuthorBookModel,
    conn?: EntityManager | undefined,
  ): Promise<AuthorBookModel> {
    const authorBookEntity = this.toAuthorBookEntity(data);
    if (conn) {
      const result = await conn
        .getRepository(AuthorBook)
        .save(authorBookEntity);
      return this.toAuthorBook(result);
    } else {
      const result = await this.authorBookEntityRepository.save(
        authorBookEntity,
      );
      return this.toAuthorBook(result);
    }
  }

  private toAuthorBook(data: AuthorBook): AuthorBookModel {
    const result = new AuthorBookModel();
    result.authorId = data.authorId;
    result.author = data.author;
    result.book = data.book;
    result.bookId = data.bookId;
    result.createdAt = data.createdAt;
    result.updatedAt = data.updatedAt;
    result.deletedAt = data.deletedAt;

    return result;
  }

  private toAuthorBookEntity(data: CreateAuthorBookModel): AuthorBook {
    const result = new AuthorBook();
    result.authorId = data.authorId;
    result.bookId = data.bookId;
    return result;
  }
}
