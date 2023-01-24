import {
  CreateUserModel,
  UserModel,
  UpdateUserModel,
} from '@domain/model/database/user';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User } from '@infra/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class DatabaseUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,
  ) {}

  async create(
    data: CreateUserModel,
    conn?: EntityManager | undefined,
  ): Promise<UserModel> {
    const userEntity = this.toUserEntity(data);
    if (conn) {
      const result = await conn.getRepository(User).save(userEntity);
      return this.toUser(result);
    } else {
      const result = await this.userEntityRepository.save(userEntity);
      return this.toUser(result);
    }
  }

  async findOneByEmail(email: string): Promise<UserModel | null> {
    const result = await this.userEntityRepository.findOne({
      where: { email },
    });
    if (!result) {
      return null;
    }
    return this.toUser(result);
  }

  async findOneById(
    id: number,
    conn?: EntityManager | undefined,
  ): Promise<UserModel | null> {
    let result: User | null = null;

    if (conn) {
      result = await conn.getRepository(User).findOne({ where: { id } });
    } else {
      result = await this.userEntityRepository.findOne({
        where: { id },
      });
    }

    if (!result) {
      return null;
    }
    return this.toUser(result);
  }

  async update(
    id: number,
    data: UpdateUserModel,
    conn?: EntityManager | undefined,
  ): Promise<void> {
    if (conn) {
      await conn.getRepository(User).update({ id }, data);
    } else {
      await this.userEntityRepository.update({ id }, data);
    }
  }

  async softDelete(id: number): Promise<boolean> {
    const result = await this.userEntityRepository.softDelete({ id });

    if (!result.affected) {
      return false;
    }
    return true;
  }

  private toUser(data: User): UserModel {
    const result = new UserModel();

    result.id = data.id;
    result.name = data.name;
    result.zipCode = data.zipCode;
    result.address = data.address;
    result.email = data.email;
    result.password = data.password;
    result.role = data.role;
    result.pointId = data.pointId;
    result.point = data.point;

    result.createdAt = data.createdAt;
    result.updatedAt = data.updatedAt;
    result.deletedAt = data.deletedAt;

    return result;
  }

  private toUserEntity(data: CreateUserModel): User {
    const result = new User();

    result.name = data.name;
    result.email = data.email;
    result.zipCode = data.zipCode;
    result.address = data.address;
    result.password = data.password;
    result.role = data.role;
    result.pointId = data.pointId;

    return result;
  }
}
