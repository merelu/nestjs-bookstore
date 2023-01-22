import { ICommonModel } from '@domain/model/common/common';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class CommonEntity implements ICommonModel {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @DeleteDateColumn()
  deletedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
