import { Column, Entity } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity()
export class User extends CommonEntity {
  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;
}
