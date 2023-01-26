import {
  CreateProductModel,
  ProductModel,
} from '@domain/model/database/product';
import { IProductRepository } from '@domain/repositories/product.repository.interface';
import { Product } from '@infra/entities/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

@Injectable()
export class DatabaseProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productEntityRepository: Repository<Product>,
  ) {}
  async findDetailWithPagination(
    page: number,
    size: number,
    requestedAt: Date,
  ): Promise<ProductModel[]> {
    const result = await this.productEntityRepository
      .createQueryBuilder('product')
      .select([
        'product',
        'book',
        'inventory',
        'authorBooks',
        'author',
        'seller',
        'coverImage.url',
      ])
      .where('product.created_at < :requestedAt', {
        requestedAt,
      })
      .orderBy('product.created_at', 'DESC')
      .innerJoin('product.book', 'book')
      .innerJoin('product.inventory', 'inventory')
      .innerJoin('book.authorBooks', 'authorBooks')
      .innerJoin('book.coverImage', 'coverImage')
      .innerJoin('authorBooks.author', 'author')
      .innerJoin('product.seller', 'seller')
      .limit(size)
      .offset(page * size)
      .getMany();

    return result.map((i) => this.toProduct(i));
  }
  async findOneByQueryWithRelation(
    query: FindOptionsWhere<ProductModel>,
    relations: FindOptionsRelations<ProductModel>,
  ): Promise<ProductModel | null> {
    const result = await this.productEntityRepository.findOne({
      where: query,
      relations,
    });

    if (!result) {
      return null;
    }

    return this.toProduct(result);
  }

  async findOneByIdWithRelation(
    id: number,
    relations: FindOptionsRelations<ProductModel>,
  ): Promise<ProductModel | null> {
    const result = await this.productEntityRepository.findOne({
      where: { id },
      relations,
    });

    if (!result) {
      return null;
    }

    return this.toProduct(result);
  }

  async create(
    data: CreateProductModel,
    conn: EntityManager,
  ): Promise<ProductModel> {
    const productEntity = this.toProductEntity(data);
    if (conn) {
      const result = await conn.getRepository(Product).save(productEntity);
      return this.toProduct(result);
    } else {
      const result = await this.productEntityRepository.save(productEntity);
      return this.toProduct(result);
    }
  }

  async findOneById(
    id: number,
    conn?: EntityManager | undefined,
  ): Promise<ProductModel | null> {
    let result: Product | null = null;

    if (conn) {
      result = await conn.getRepository(Product).findOne({ where: { id } });
    } else {
      result = await this.productEntityRepository.findOne({ where: { id } });
    }
    if (!result) {
      return null;
    }

    return this.toProduct(result);
  }

  async findOneByIdWithDetail(
    id: number,
    conn?: EntityManager | undefined,
  ): Promise<ProductModel | null> {
    let result: Product | null = null;
    if (conn) {
      result = await conn
        .getRepository(Product)
        .createQueryBuilder('product')
        .select([
          'product',
          'book',
          'inventory',
          'authorBooks',
          'author',
          'seller',
          'coverImage.url',
        ])
        .where('product.id = :id', { id })
        .innerJoin('product.book', 'book')
        .innerJoin('product.inventory', 'inventory')
        .innerJoin('book.authorBooks', 'authorBooks')
        .innerJoin('book.coverImage', 'coverImage')
        .innerJoin('authorBooks.author', 'author')
        .innerJoin('product.seller', 'seller')
        .getOne();
    } else {
      result = await this.productEntityRepository
        .createQueryBuilder('product')
        .select([
          'product',
          'book',
          'inventory',
          'authorBooks',
          'author',
          'seller',
          'coverImage.url',
        ])
        .where('product.id = :id', { id })
        .innerJoin('product.book', 'book')
        .innerJoin('product.inventory', 'inventory')
        .innerJoin('book.authorBooks', 'authorBooks')
        .innerJoin('book.coverImage', 'coverImage')
        .innerJoin('authorBooks.author', 'author')
        .innerJoin('product.seller', 'seller')
        .getOne();
    }

    if (!result) {
      return null;
    }

    return this.toProduct(result);
  }

  private toProduct(data: Product): ProductModel {
    const result = new ProductModel();
    result.id = data.id;

    result.price = data.price;
    result.inventoryId = data.inventoryId;
    result.inventory = data.inventory;
    result.bookId = data.bookId;
    result.book = data.book;

    result.sellerId = data.sellerId;
    result.seller = data.seller;
    result.orderProducts = data.orderProducts;

    result.createdAt = data.createdAt;
    result.updatedAt = data.updatedAt;
    result.deletedAt = data.deletedAt;

    return result;
  }

  private toProductEntity(data: CreateProductModel): Product {
    const result = new Product();
    result.bookId = data.bookId;
    result.inventoryId = data.inventoryId;
    result.price = data.price;
    result.sellerId = data.sellerId;

    return result;
  }
}
