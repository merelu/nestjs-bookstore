import {
  CreateUserModel,
  UpdateUserModel,
  UserModel,
} from '@domain/model/database/user';
import { EntityManager } from 'typeorm';

export interface IUserRepository {
  create(data: CreateUserModel, conn?: EntityManager): Promise<UserModel>;

  findOneById(id: number, conn?: EntityManager): Promise<UserModel | null>;

  update(
    id: number,
    data: UpdateUserModel,
    conn?: EntityManager,
  ): Promise<void>;

  softDelete(id: number): Promise<boolean>;
}
