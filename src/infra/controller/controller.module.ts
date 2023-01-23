import { JwtRefreshTokenStrategy } from '@infra/common/strategies/jwt-refresh.strategy';
import { JwtStrategy } from '@infra/common/strategies/jwt.strategy';
import { LocalStrategy } from '@infra/common/strategies/local.strategy';
import { EnvironmentConfigModule } from '@infra/config/environment-config/environment-config.module';
import { ExceptionModule } from '@infra/services/exception/exception.module';
import { UseCasesProxyModule } from '@infra/usecases-proxy/usecases-proxy.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AuthController } from './auth/auth.controller';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    UseCasesProxyModule.register(),
    TerminusModule,
    HttpModule,
    ExceptionModule,
    EnvironmentConfigModule,
  ],
  controllers: [HealthController, AuthController],
  providers: [JwtStrategy, JwtRefreshTokenStrategy, LocalStrategy],
})
export class ControllersModule {}
