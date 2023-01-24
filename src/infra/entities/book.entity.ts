import { AuthorBookModel } from '@domain/model/database/author-book';
import { IBookModel } from '@domain/model/database/book';
import { CoverImageModel } from '@domain/model/database/cover-image';
import { ProductModel } from '@domain/model/database/product';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { AuthorBook } from './author-book.entity';
import { CommonEntity } from './common.entity';
import { CoverImage } from './cover-image.entity';
import { Product } from './product.entity';

@Entity()
export class Book extends CommonEntity implements IBookModel {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'integer', nullable: true })
  coverImageId?: number;

  @OneToOne(() => CoverImage, { nullable: true })
  @JoinColumn({ name: 'cover_image_id' })
  coverImage?: CoverImageModel;

  @OneToMany(() => AuthorBook, (authorBook) => authorBook.book, {
    nullable: true,
  })
  authorBooks?: AuthorBookModel[];

  @OneToOne(() => Product, (product) => product.book, { nullable: true })
  product?: ProductModel;
}
