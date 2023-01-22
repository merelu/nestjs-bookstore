import { ControllersModule } from '@infra/controller/controller.module';
import { UseCasesProxyModule } from '@infra/usecases-proxy/usecases-proxy.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [UseCasesProxyModule.register(), ControllersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
