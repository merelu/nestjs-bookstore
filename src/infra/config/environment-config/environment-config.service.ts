import { IDatabaseConfig } from '@domain/config/database-config.interface';
import { IJwtConfig } from '@domain/config/jwt-config.interface';
import { IRedisConfig } from '@domain/config/redis-config.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentConfigService
  implements IDatabaseConfig, IJwtConfig, IRedisConfig
{
  constructor(private configService: ConfigService) {}
  getRedisHost(): string {
    return this.configService.get<string>('REDIS_HOST') as string;
  }
  getRedisPort(): number {
    return this.configService.get<number>('REDIS_PORT') as number;
  }
  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET') as string;
  }
  getJwtExpirationTime(): number {
    return this.configService.get<number>('JWT_EXPIRATION_TIME') as number;
  }

  getJwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET') as string;
  }

  getJwtRefreshExpirationTime(): number {
    return this.configService.get<number>(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    ) as number;
  }

  getDatabasePort(): number {
    return this.configService.get<number>('DATABASE_PORT') as number;
  }

  getDatabaseHost(): string {
    return this.configService.get<string>('DATABASE_HOST') as string;
  }

  getDatabaseUser(): string {
    return this.configService.get<string>('DATABASE_USER') as string;
  }

  getDatabasePassword(): string {
    return this.configService.get<string>('DATABASE_PASSWORD') as string;
  }

  getDatabaseName(): string {
    return this.configService.get<string>('DATABASE_NAME') as string;
  }

  getDatabaseSchema(): string {
    return this.configService.get<string>('DATABASE_SCHEMA') as string;
  }

  getDatabaseSync(): boolean {
    return this.configService.get<boolean>('DATABASE_SYNCHRONIZE') as boolean;
  }
}
