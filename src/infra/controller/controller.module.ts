import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [],
})
export class ControllersModule {}
