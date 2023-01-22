import { TypeOrmConfigModule } from '@infra/config/typeorm/typeorm.module';
import { User } from '@infra/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([User])],
  providers: [],
  exports: [],
})
export class RepositoriesModule {}
