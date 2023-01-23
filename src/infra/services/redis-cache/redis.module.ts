import { IRedisConfig } from '@domain/config/redis-config.interface';
import { EnvironmentConfigModule } from '@infra/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '@infra/config/environment-config/environment-config.service';
import { Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';

export const REDIS_CACHE = 'REDIS_CACHE';

@Module({
  imports: [EnvironmentConfigModule],
  providers: [
    {
      provide: REDIS_CACHE,
      useFactory: async (configService: IRedisConfig) =>
        await redisStore({
          socket: {
            host: configService.getRedisHost(),
            port: +configService.getRedisPort(),
          },
          ttl: 60 * 60 * 24 * 7,
        }),
      inject: [EnvironmentConfigService],
    },
  ],
  exports: [REDIS_CACHE],
})
export class RedisModule {}
