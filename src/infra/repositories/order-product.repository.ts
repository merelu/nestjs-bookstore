import {
  CreateOrderProductModel,
  OrderProductModel,
} from '@domain/model/database/order-product';
import { IOrderProductRepository } from '@domain/repositories/order-product.repository.interface';
import { OrderProduct } from '@infra/entities/order-product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class DatabaseOrderProductRepository implements IOrderProductRepository {
  constructor(
    @InjectRepository(OrderProduct)
    private readonly orderProductEntityRepository: Repository<OrderProduct>,
  ) {}

  async create(
    data: CreateOrderProductModel,
    conn?: EntityManager | undefined,
  ): Promise<OrderProductModel> {
    const orderProductEntity = this.toOrderProductEntity(data);
    if (conn) {
      const result = await conn
        .getRepository(OrderProduct)
        .save(orderProductEntity);
      return this.toOrderProduct(result);
    } else {
      const result = await this.orderProductEntityRepository.save(
        orderProductEntity,
      );
      return this.toOrderProduct(result);
    }
  }

  private toOrderProduct(data: OrderProduct): OrderProductModel {
    const result = new OrderProductModel();

    result.id = data.id;
    result.orderCount = data.orderCount;
    result.price = data.price;
    result.orderId = data.orderId;
    result.order = data.order;
    result.productId = data.productId;
    result.product = data.product;
    result.createdAt = data.createdAt;
    result.updatedAt = data.updatedAt;
    result.deletedAt = data.deletedAt;

    return result;
  }

  private toOrderProductEntity(data: CreateOrderProductModel) {
    const result = new OrderProduct();

    result.orderCount = data.orderCount;
    result.orderId = data.orderId;
    result.productId = data.productId;
    result.price = data.price;

    return result;
  }
}
