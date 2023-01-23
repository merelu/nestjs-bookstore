import { TypeOrmConfigModule } from '@infra/config/typeorm/typeorm.module';
import { PointLog } from '@infra/entities/point-log.entity';
import { Point } from '@infra/entities/point.entity';
import { Role } from '@infra/entities/role.entity';
import { User } from '@infra/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabasePointLogRepository } from './point-log.repository';
import { DatabasePointRepository } from './point.repository';
import { DatabaseRoleRepository } from './role.repository';
import { DatabaseUserRepository } from './user.repository';

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([User, Role, Point, PointLog]),
  ],
  providers: [
    DatabaseUserRepository,
    DatabaseRoleRepository,
    DatabasePointRepository,
    DatabasePointLogRepository,
  ],
  exports: [
    DatabaseUserRepository,
    DatabaseRoleRepository,
    DatabasePointRepository,
    DatabasePointLogRepository,
  ],
})
export class RepositoriesModule {}
