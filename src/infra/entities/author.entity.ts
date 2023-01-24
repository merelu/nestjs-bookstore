import { IAuthorModel } from '@domain/model/database/author';
import { AuthorBookModel } from '@domain/model/database/author-book';
import { Column, Entity, OneToMany } from 'typeorm';
import { AuthorBook } from './author-book.entity';
import { CommonEntity } from './common.entity';

@Entity()
export class Author extends CommonEntity implements IAuthorModel {
  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => AuthorBook, (authorBook) => authorBook.author, {
    nullable: true,
  })
  authorBooks: AuthorBookModel[];
}
