import { ICoverImage } from '@domain/model/database/cover-image';
import { Column, Entity } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity()
export class CoverImage extends CommonEntity implements ICoverImage {
  @Column({ type: 'varchar' })
  filename: string;

  @Column({
    type: 'bytea',
  })
  data: Uint8Array;

  @Column({
    type: 'text',
    nullable: true,
  })
  url?: string;
}
