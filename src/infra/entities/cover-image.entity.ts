import { BookModel } from '@domain/model/database/book';
import { ICoverImage } from '@domain/model/database/cover-image';
import { UserModel } from '@domain/model/database/user';
import { Column, Entity, Index, ManyToOne, OneToOne } from 'typeorm';
import { Book } from './book.entity';
import { CommonEntity } from './common.entity';
import { User } from './user.entity';

@Entity()
@Index('CoverImage_uploader_id', ['uploaderId'], {})
export class CoverImage extends CommonEntity implements ICoverImage {
  @Column({ type: 'varchar' })
  filename: string;

  @OneToOne(() => Book, (book) => book.coverImage, { nullable: true })
  book?: BookModel;

  @Column({ type: 'integer', nullable: true })
  uploaderId?: number;

  @ManyToOne(() => User, (user) => user.coverImages, { nullable: true })
  uploader?: UserModel;

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
