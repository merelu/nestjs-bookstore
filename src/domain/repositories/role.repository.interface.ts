import { CreateRoleModel, RoleModel } from '@domain/model/database/role';
import { EntityManager } from 'typeorm';

export interface IRoleRepository {
  create(data: CreateRoleModel, conn?: EntityManager): Promise<RoleModel>;

  softDelete(id: number): Promise<boolean>;
}
