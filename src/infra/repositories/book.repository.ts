import { CreateBookModel, BookModel } from '@domain/model/database/book';
import { IBookRepository } from '@domain/repositories/book.repository.interface';
import { Book } from '@infra/entities/book.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class DatabaseBookRepository implements IBookRepository {
  constructor(
    @InjectRepository(Book)
    private readonly bookEntityRepository: Repository<Book>,
  ) {}

  async create(
    data: CreateBookModel,
    conn?: EntityManager | undefined,
  ): Promise<BookModel> {
    const bookEntity = this.toBookEntity(data);
    if (conn) {
      const result = await conn.getRepository(Book).save(bookEntity);
      return this.toBook(result);
    } else {
      const result = await this.bookEntityRepository.save(bookEntity);
      return this.toBook(result);
    }
  }

  async findOneById(
    id: number,
    conn?: EntityManager,
  ): Promise<BookModel | null> {
    let result: Book | null = null;

    if (conn) {
      result = await conn.getRepository(Book).findOne({ where: { id } });
    } else {
      result = await this.bookEntityRepository.findOne({ where: { id } });
    }
    if (!result) {
      return null;
    }

    return this.toBook(result);
  }

  private toBook(data: Book): BookModel {
    const result = new BookModel();
    result.id = data.id;

    result.name = data.name;
    result.description = data.description;
    result.coverImageId = data.coverImageId;
    result.coverImage = data.coverImage;
    result.authorBooks = data.authorBooks;
    result.product = data.product;

    result.createdAt = data.createdAt;
    result.updatedAt = data.updatedAt;
    result.deletedAt = data.deletedAt;

    return result;
  }

  private toBookEntity(data: CreateBookModel): Book {
    const result = new Book();
    result.name = data.name;
    result.description = data.description;
    result.coverImageId = data.coverImageId;
    return result;
  }
}
