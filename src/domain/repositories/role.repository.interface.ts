import { CreateRoleModel, RoleModel } from '@domain/model/database/role';
import { EntityManager } from 'typeorm';

export interface IRoleRepository {
  create(data: CreateRoleModel, conn?: EntityManager): Promise<RoleModel>;

  insertMany(data: CreateRoleModel[], conn?: EntityManager): Promise<boolean>;

  delete(id: number): Promise<boolean>;
}
