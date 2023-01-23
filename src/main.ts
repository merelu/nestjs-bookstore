import { AllExceptionFilter } from '@infra/common/filters/exception.filter';
import { LoggingInterceptor } from '@infra/common/interceptors/logger.interceptor';
import { ResponseInterceptor } from '@infra/common/interceptors/response.interceptor';
import { LoggerService } from '@infra/services/logger/logger.service';
import { createValidationException } from '@infra/utils/create-validation-exception';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const env = process.env.NODE_ENV;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(cookieParser());
  app.set('trust poxy', 1);

  // filters
  app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));

  // pipes
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => createValidationException(errors),
    }),
  );

  // interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
  app.useGlobalInterceptors(new ResponseInterceptor(new LoggerService()));

  if (env !== 'production') {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('fanddle-test')
      .setDescription('스웨거')
      .setVersion('0.0.1')
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      deepScanRoutes: true,
    });
    SwaggerModule.setup('doc', app, document, {
      useGlobalPrefix: true,
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'method',
      },
    });
  }

  await app.listen(3001);
}
bootstrap();
