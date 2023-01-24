import { CreateOrderModel, OrderModel } from '@domain/model/database/order';
import { IOrderRepository } from '@domain/repositories/order.repository.interface';
import { Order } from '@infra/entities/order.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class DatabaseOrderRepository implements IOrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderEntityRepository: Repository<Order>,
  ) {}

  async findOneDetailById(
    id: number,
    conn?: EntityManager | undefined,
  ): Promise<OrderModel | null> {
    let result: Order | null = null;
    if (conn) {
      result = await conn
        .getRepository(Order)
        .createQueryBuilder('order')
        .addSelect('book.name, coverImage.url')
        .innerJoinAndSelect('order.orderProducts', 'orderProducts')
        .innerJoin('orderProducts.product', 'product')
        .innerJoin('product.book', 'book')
        .innerJoin('book.coverImage', 'coverImage')
        .getOne();
    } else {
      result = await this.orderEntityRepository
        .createQueryBuilder('order')
        .addSelect('book.name, coverImage.url')
        .innerJoinAndSelect('order.orderProducts', 'orderProducts')
        .innerJoin('orderProducts.product', 'product')
        .innerJoin('product.book', 'book')
        .innerJoin('book.coverImage', 'coverImage')
        .getOne();
    }

    if (!result) {
      return null;
    }

    return this.toOrder(result);
  }

  async create(
    data: CreateOrderModel,
    conn?: EntityManager | undefined,
  ): Promise<OrderModel> {
    const orderEntity = this.toOrderEntity(data);
    if (conn) {
      const result = await conn.getRepository(Order).save(orderEntity);
      return this.toOrder(result);
    } else {
      const result = await this.orderEntityRepository.save(orderEntity);
      return this.toOrder(result);
    }
  }

  private toOrder(data: Order): OrderModel {
    const result = new OrderModel();
    result.id = data.id;
    result.orderState = data.orderState;
    result.orderDate = data.orderDate;
    result.usePoint = data.usePoint;
    result.buyerId = data.buyerId;
    result.buyer = data.buyer;
    result.orderProducts = data.orderProducts;

    result.createdAt = data.createdAt;
    result.updatedAt = data.updatedAt;
    result.deletedAt = data.deletedAt;
    return result;
  }

  private toOrderEntity(data: CreateOrderModel): Order {
    const result = new Order();
    result.orderDate = data.orderDate;
    result.buyerId = data.buyerId;
    result.usePoint = data.usePoint;
    return result;
  }
}
