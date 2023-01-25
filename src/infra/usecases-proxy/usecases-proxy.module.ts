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
import { RedisCacheModule } from '@infra/services/redis-cache/redis-cache.module';
import { LoginUseCases } from '@usecases/auth/login.usecases';
import { JwtTokenService } from '@infra/services/jwt/jwt-token.service';
import { RedisCacheService } from '@infra/services/redis-cache/redis-cache.service';
import { EnvironmentConfigService } from '@infra/config/environment-config/environment-config.service';
import { IRedisCacheService } from '@domain/adpaters/redis-cache.interface';
import { DatabaseCoverImageRepository } from '@infra/repositories/cover-image.repository';
import { AddCoverImageUseCases } from '@usecases/book/add-cover-image.usecases';
import { GetCoverImageUseCases } from '@usecases/book/get-cover-image.usecases';
import { DatabaseBookRepository } from '@infra/repositories/book.repository';
import { DatabaseAuthorRepository } from '@infra/repositories/author.repository';
import { DatabaseAuthorBookRepository } from '@infra/repositories/author-book.repository';
import { DatabaseProductRepository } from '@infra/repositories/product.repository';
import { DatabaseInventoryRepository } from '@infra/repositories/inventory.repository';
import { AddProductUseCases } from '@usecases/product/add-product.usecases';
import { AddOrderUseCases } from '@usecases/order/add-order.usecases';
import { DatabaseOrderRepository } from '@infra/repositories/order.repository';
import { DatabaseOrderProductRepository } from '@infra/repositories/order-product.repository';
import { GetOrdersUseCases } from '@usecases/order/get-orders.usecases';
import { CancelOrderUseCases } from '@usecases/order/cancel-order.usecases';
import { CheckInventoryUseCases } from '@usecases/product/check-inventory.usecases';
import { UpdateCoverImageUseCases } from '@usecases/book/update-cover-image.usecases';
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

  static ADD_COVER_IMAGE_USECASES_PROXY = 'AddCoverImageUseCasesProxy';
  static GET_COVER_IMAGE_USECASES_PROXY = 'GetCoverImageUseCasesProxy';
  static UPDATE_COVER_IMAGE_USECASES_PROXY = 'UpdateCoverImageUseCasesProxy';

  static ADD_PRODUCT_USECASES_PROXY = 'AddProductUseCasesProxy';
  static CHECK_INVENTORY_USECASES_PROXY = 'CheckInventoryUseCasesProxy';

  static ADD_ORDER_USECASES_PROXY = 'AddOrderUseCasesProxy';
  static GET_ORDERS_USECASES_PROXY = 'GetOrdersUseCasesProxy';

  static CANCEL_ORDER_USECASES_PROXY = 'CancelOrderUseCasesProxy';

  static register(): DynamicModule {
    return {
      module: UseCasesProxyModule,
      providers: [
        {
          inject: [
            DatabaseUserRepository,
            DatabasePointRepository,
            DatabasePointLogRepository,
            BcryptService,
            ExceptionService,
          ],
          provide: UseCasesProxyModule.SIGNUP_USECASES_PROXY,
          useFactory: (
            userRepo: DatabaseUserRepository,
            pointRepo: DatabasePointRepository,
            pointLogRepo: DatabasePointLogRepository,
            bcryptService: BcryptService,
            exceptionService: ExceptionService,
          ) =>
            new UseCaseProxy(
              new SignupUseCases(
                userRepo,
                pointRepo,
                pointLogRepo,
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
        {
          inject: [
            DatabaseCoverImageRepository,
            ExceptionService,
            EnvironmentConfigService,
          ],
          provide: UseCasesProxyModule.ADD_COVER_IMAGE_USECASES_PROXY,
          useFactory: (
            coverImageRepo: DatabaseCoverImageRepository,
            exceptionService: ExceptionService,
            configService: EnvironmentConfigService,
          ) =>
            new UseCaseProxy(
              new AddCoverImageUseCases(
                coverImageRepo,
                exceptionService,
                configService,
              ),
            ),
        },
        {
          inject: [DatabaseCoverImageRepository, ExceptionService],
          provide: UseCasesProxyModule.GET_COVER_IMAGE_USECASES_PROXY,
          useFactory: (
            coverImageRepo: DatabaseCoverImageRepository,
            exceptionService: ExceptionService,
          ) =>
            new UseCaseProxy(
              new GetCoverImageUseCases(coverImageRepo, exceptionService),
            ),
        },
        {
          inject: [
            DatabaseBookRepository,
            DatabaseAuthorRepository,
            DatabaseAuthorBookRepository,
            DatabaseProductRepository,
            DatabaseInventoryRepository,
            DatabaseCoverImageRepository,
            ExceptionService,
          ],
          provide: UseCasesProxyModule.ADD_PRODUCT_USECASES_PROXY,
          useFactory: (
            bookRepo: DatabaseBookRepository,
            authorRepo: DatabaseAuthorRepository,
            authorBookRepo: DatabaseAuthorBookRepository,
            productRepo: DatabaseProductRepository,
            inventoryRepo: DatabaseInventoryRepository,
            coverImageRepo: DatabaseCoverImageRepository,
            exceptionService: ExceptionService,
          ) =>
            new UseCaseProxy(
              new AddProductUseCases(
                bookRepo,
                authorRepo,
                authorBookRepo,
                productRepo,
                inventoryRepo,
                coverImageRepo,
                exceptionService,
              ),
            ),
        },
        {
          inject: [
            DatabaseProductRepository,
            DatabasePointRepository,
            DatabasePointLogRepository,
            DatabaseOrderRepository,
            DatabaseOrderProductRepository,
            DatabaseInventoryRepository,
            ExceptionService,
          ],
          provide: UseCasesProxyModule.ADD_ORDER_USECASES_PROXY,
          useFactory: (
            productRepo: DatabaseProductRepository,
            pointRepo: DatabasePointRepository,
            pointLogRepo: DatabasePointLogRepository,
            orderRepo: DatabaseOrderRepository,
            orderProductRepo: DatabaseOrderProductRepository,
            inventoryRepo: DatabaseInventoryRepository,
            exceptionService: ExceptionService,
          ) =>
            new UseCaseProxy(
              new AddOrderUseCases(
                productRepo,
                pointRepo,
                pointLogRepo,
                orderRepo,
                orderProductRepo,
                inventoryRepo,
                exceptionService,
              ),
            ),
        },
        {
          inject: [DatabaseOrderRepository, ExceptionService],
          provide: UseCasesProxyModule.GET_ORDERS_USECASES_PROXY,
          useFactory: (
            orderRepo: DatabaseOrderRepository,
            exceptionService: ExceptionService,
          ) =>
            new UseCaseProxy(
              new GetOrdersUseCases(orderRepo, exceptionService),
            ),
        },
        {
          inject: [DatabaseOrderRepository, ExceptionService],
          provide: UseCasesProxyModule.CANCEL_ORDER_USECASES_PROXY,
          useFactory: (
            orderRepo: DatabaseOrderRepository,
            exceptionService: ExceptionService,
          ) =>
            new UseCaseProxy(
              new CancelOrderUseCases(orderRepo, exceptionService),
            ),
        },
        {
          inject: [DatabaseProductRepository, ExceptionService],
          provide: UseCasesProxyModule.CHECK_INVENTORY_USECASES_PROXY,
          useFactory: (
            productRepo: DatabaseProductRepository,
            exceptionService: ExceptionService,
          ) =>
            new UseCaseProxy(
              new CheckInventoryUseCases(productRepo, exceptionService),
            ),
        },
        {
          inject: [
            DatabaseProductRepository,
            DatabaseCoverImageRepository,
            ExceptionService,
          ],
          provide: UseCasesProxyModule.UPDATE_COVER_IMAGE_USECASES_PROXY,
          useFactory: (
            productRepo: DatabaseProductRepository,
            coverImageRepo: DatabaseCoverImageRepository,
            exceptionService: ExceptionService,
          ) =>
            new UseCaseProxy(
              new UpdateCoverImageUseCases(
                productRepo,
                coverImageRepo,
                exceptionService,
              ),
            ),
        },
      ],
      exports: [
        UseCasesProxyModule.SIGNUP_USECASES_PROXY,
        UseCasesProxyModule.LOGIN_USECASES_PROXY,

        UseCasesProxyModule.ADD_COVER_IMAGE_USECASES_PROXY,
        UseCasesProxyModule.GET_COVER_IMAGE_USECASES_PROXY,
        UseCasesProxyModule.UPDATE_COVER_IMAGE_USECASES_PROXY,

        UseCasesProxyModule.ADD_PRODUCT_USECASES_PROXY,

        UseCasesProxyModule.CHECK_INVENTORY_USECASES_PROXY,

        UseCasesProxyModule.ADD_ORDER_USECASES_PROXY,
        UseCasesProxyModule.GET_ORDERS_USECASES_PROXY,

        UseCasesProxyModule.CANCEL_ORDER_USECASES_PROXY,
      ],
    };
  }
}
