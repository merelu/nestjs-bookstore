import { EnvironmentConfigModule } from '@infra/config/environment-config/environment-config.module';
import { RepositoriesModule } from '@infra/repositories/repositories.module';
import { BcryptModule } from '@infra/services/bcrypt/bcrypt.module';
import { ExceptionModule } from '@infra/services/exception/exception.module';
import { JwtServiceModule } from '@infra/services/jwt/jwt.module';
import { LoggerModule } from '@infra/services/logger/logger.module';
import { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    JwtServiceModule,
    BcryptModule,
    LoggerModule,
    ExceptionModule,
    RepositoriesModule,
    EnvironmentConfigModule,
  ],
})
export class UseCasesProxyModule {
  //   static CREATE_USER_USECASES_PROXY = 'CreateUserUseCasesProxy';

  static register(): DynamicModule {
    return {
      module: UseCasesProxyModule,
      providers: [
        // {
        //   inject: [DatabaseUserRepository, ExceptionService],
        //   provide: UseCasesProxyModule.CREATE_USER_USECASES_PROXY,
        //   useFactory: (
        //     userRepo: DatabaseUserRepository,
        //     exceptionService: ExceptionService,
        //   ) =>
        //     new UseCaseProxy(
        //       new CreateUserUseCases(userRepo, exceptionService),
        //     ),
        // },
      ],
      exports: [],
    };
  }
}
