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
      .setTitle('Bookstore')
      .setDescription(
        `<p>스웨거 문서입니다. 쿠키를 사용한 인증 방식을 제공합니다.</p> 
         <p>스웨거상 수동 쿠키, 토큰 입력 Auth 기능은 제공하지 않습니다.</p>
         <p>로그인 API를 실행하게 되면 로그인이 되고 스웨거문서 사이트에 Set-Cookie되므로
         인증이 필요한 API를 실행할 수 있습니다.</p>
         <p>인증이 불필요한 API를 태스트 하기 위해서는 로그아웃 API를 실행하고 실행해주세요!</p>
         `,
      )
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

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
