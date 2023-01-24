import { AuthorModel } from '@domain/model/database/author';
import { IAuthorBookModel } from '@domain/model/database/author-book';
import { BookModel } from '@domain/model/database/book';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Author } from './author.entity';
import { Book } from './book.entity';
import { CommonEntity } from './common.entity';

@Entity()
export class AuthorBook extends CommonEntity implements IAuthorBookModel {
  @Column({ type: 'integer', nullable: true })
  authorId?: number;

  @ManyToOne(() => Author, (author) => author.authorBooks, { nullable: true })
  author?: AuthorModel;

  @Column({ type: 'integer', nullable: true })
  bookId?: number;

  @ManyToOne(() => Book, (book) => book.authorBooks, { nullable: true })
  book?: BookModel;
}
