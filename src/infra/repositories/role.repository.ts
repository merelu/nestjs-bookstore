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

  async insertMany(
    data: CreateRoleModel[],
    conn?: EntityManager | undefined,
  ): Promise<boolean> {
    const roleEntities = data.map((v) => this.toRoleEntity(v));

    if (conn) {
      const result = await conn.getRepository(Role).insert(roleEntities);

      if (result.identifiers.length !== data.length) {
        return false;
      }
      return true;
    } else {
      const result = await this.roleEntityRepository.insert(roleEntities);

      if (result.identifiers.length !== data.length) {
        return false;
      }
      return true;
    }
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.roleEntityRepository.delete({ id });

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

    return result;
  }

  private toRoleEntity(data: CreateRoleModel): Role {
    const result = new Role();

    result.userId = data.userId;
    result.role = data.role;

    return result;
  }
}
