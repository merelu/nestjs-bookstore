import { CreateRoleModel, RoleModel } from '@domain/model/database/role';
import { IRoleRepository } from '@domain/repositories/role.repository.interface';
import { Role } from '@infra/entities/role.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class DatabaseRoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(Role)
    private readonly roleEntityRepository: Repository<Role>,
  ) {}

  async create(
    data: CreateRoleModel,
    conn?: EntityManager | undefined,
  ): Promise<RoleModel> {
    const roleEntity = this.toRoleEntity(data);
    if (conn) {
      const result = await conn.getRepository(Role).save(roleEntity);
      return this.toRole(result);
    } else {
      const result = await this.roleEntityRepository.save(roleEntity);
      return this.toRole(result);
    }
  }
  async softDelete(id: number): Promise<boolean> {
    const result = await this.roleEntityRepository.softDelete({ id });

    if (!result.affected) {
      return false;
    }
    return true;
  }

  private toRole(data: Role): RoleModel {
    const result = new RoleModel();

    result.id = data.id;
    result.role = data.role;

    result.createdAt = data.createdAt;
    result.updatedAt = data.updatedAt;
    result.deletedAt = data.deletedAt;

    return result;
  }

  private toRoleEntity(data: CreateRoleModel): Role {
    const result = new Role();

    result.userId = data.userId;
    result.role = data.role;

    return result;
  }
}
