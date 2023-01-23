import { EnvironmentConfigModule } from '@infra/config/environment-config/environment-config.module';
import { DatabasePointLogRepository } from '@infra/repositories/point-log.repository';
import { DatabasePointRepository } from '@infra/repositories/point.repository';
import { RepositoriesModule } from '@infra/repositories/repositories.module';
import { DatabaseUserRepository } from '@infra/repositories/user.repository';
import { BcryptModule } from '@infra/services/bcrypt/bcrypt.module';
import { BcryptService } from '@infra/services/bcrypt/bcrypt.service';
import { ExceptionModule } from '@infra/services/exception/exception.module';
import { ExceptionService } from '@infra/services/exception/exception.service';
import { JwtServiceModule } from '@infra/services/jwt/jwt.module';
import { LoggerModule } from '@infra/services/logger/logger.module';
import { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { UseCaseProxy } from './usecases-proxy';
import { SignupUseCases } from '@usecases/auth/signup.usecases';
import { DatabaseRoleRepository } from '@infra/repositories/role.repository';
import { RedisCacheModule } from '@infra/services/redis-cache/redis-cache.module';
import { LoginUseCases } from '@usecases/auth/login.usecases';
import { JwtTokenService } from '@infra/services/jwt/jwt-token.service';
import { RedisCacheService } from '@infra/services/redis-cache/redis-cache.service';
import { EnvironmentConfigService } from '@infra/config/environment-config/environment-config.service';
import { IRedisCacheService } from '@domain/adpaters/redis-cache.interface';
@Module({
  imports: [
    JwtServiceModule,
    BcryptModule,
    LoggerModule,
    ExceptionModule,
    RepositoriesModule,
    EnvironmentConfigModule,
    RedisCacheModule,
  ],
})
export class UseCasesProxyModule {
  static SIGNUP_USECASES_PROXY = 'SignupUseCasesProxy';
  static LOGIN_USECASES_PROXY = 'LoginUseCasesProxy';

  static register(): DynamicModule {
    return {
      module: UseCasesProxyModule,
      providers: [
        {
          inject: [
            DatabaseUserRepository,
            DatabasePointRepository,
            DatabasePointLogRepository,
            DatabaseRoleRepository,
            BcryptService,
            ExceptionService,
          ],
          provide: UseCasesProxyModule.SIGNUP_USECASES_PROXY,
          useFactory: (
            userRepo: DatabaseUserRepository,
            pointRepo: DatabasePointRepository,
            pointLogRepo: DatabasePointLogRepository,
            roleRepo: DatabaseRoleRepository,
            bcryptService: BcryptService,
            exceptionService: ExceptionService,
          ) =>
            new UseCaseProxy(
              new SignupUseCases(
                userRepo,
                pointRepo,
                pointLogRepo,
                roleRepo,
                bcryptService,
                exceptionService,
              ),
            ),
        },
        {
          inject: [
            DatabaseUserRepository,
            BcryptService,
            EnvironmentConfigService,
            JwtTokenService,
            RedisCacheService,
          ],
          provide: UseCasesProxyModule.LOGIN_USECASES_PROXY,
          useFactory: (
            userRepo: DatabaseUserRepository,
            bcryptService: BcryptService,
            configService: EnvironmentConfigService,
            jwtService: JwtTokenService,
            redisCacheService: IRedisCacheService,
          ) =>
            new UseCaseProxy(
              new LoginUseCases(
                userRepo,
                bcryptService,
                configService,
                jwtService,
                redisCacheService,
              ),
            ),
        },
      ],
      exports: [
        UseCasesProxyModule.SIGNUP_USECASES_PROXY,
        UseCasesProxyModule.LOGIN_USECASES_PROXY,
      ],
    };
  }
}
