import { TypeOrmConfigModule } from '@infra/config/typeorm/typeorm.module';
import { AuthorBook } from '@infra/entities/author-book.entity';
import { Author } from '@infra/entities/author.entity';
import { Book } from '@infra/entities/book.entity';
import { CoverImage } from '@infra/entities/cover-image.entity';
import { Inventory } from '@infra/entities/inventory.entity';
import { OrderProduct } from '@infra/entities/order-product.entity';
import { Order } from '@infra/entities/order.entity';
import { PointLog } from '@infra/entities/point-log.entity';
import { Point } from '@infra/entities/point.entity';
import { Product } from '@infra/entities/product.entity';
import { User } from '@infra/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseAuthorBookRepository } from './author-book.repository';
import { DatabaseAuthorRepository } from './author.repository';
import { DatabaseBookRepository } from './book.repository';
import { DatabaseCoverImageRepository } from './cover-image.repository';
import { DatabaseInventoryRepository } from './inventory.repository';
import { DatabasePointLogRepository } from './point-log.repository';
import { DatabasePointRepository } from './point.repository';
import { DatabaseProductRepository } from './product.repository';
import { DatabaseUserRepository } from './user.repository';

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([
      User,
      Point,
      PointLog,
      Book,
      AuthorBook,
      Author,
      CoverImage,
      Product,
      Inventory,
      Order,
      OrderProduct,
    ]),
  ],
  providers: [
    DatabaseUserRepository,
    DatabasePointRepository,
    DatabasePointLogRepository,
    DatabaseCoverImageRepository,
    DatabaseBookRepository,
    DatabaseAuthorBookRepository,
    DatabaseAuthorRepository,
    DatabaseProductRepository,
    DatabaseInventoryRepository,
  ],
  exports: [
    DatabaseUserRepository,
    DatabasePointRepository,
    DatabasePointLogRepository,
    DatabaseCoverImageRepository,
    DatabaseBookRepository,
    DatabaseAuthorBookRepository,
    DatabaseAuthorRepository,
    DatabaseProductRepository,
    DatabaseInventoryRepository,
  ],
})
export class RepositoriesModule {}
