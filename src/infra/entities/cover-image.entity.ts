import { BookModel } from '@domain/model/database/book';
import { ICoverImage } from '@domain/model/database/cover-image';
import { Column, Entity, OneToOne } from 'typeorm';
import { Book } from './book.entity';
import { CommonEntity } from './common.entity';

@Entity()
export class CoverImage extends CommonEntity implements ICoverImage {
  @Column({ type: 'varchar' })
  filename: string;

  @OneToOne(() => Book, (book) => book.coverImage, { nullable: true })
  book?: BookModel;

  @Column({
    type: 'bytea',
    nullable: true,
  })
  data: Uint8Array;

  @Column({
    type: 'text',
    nullable: true,
  })
  url?: string;
}
