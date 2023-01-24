import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { EnvironmentConfigService } from './environment-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      validationSchema: Joi.object({
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required().default(5434),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_SCHEMA: Joi.string().required(),
        DATABASE_SYNCHRONIZE: Joi.boolean().required(),

        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required().default(6380),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.number().required().default(86400),

        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.number()
          .required()
          .default(172800),

        BASE_URL: Joi.string().required(),
      }),
    }),
  ],
  providers: [EnvironmentConfigService],
  exports: [EnvironmentConfigService],
})
export class EnvironmentConfigModule {}
