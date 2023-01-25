import { IException } from '@domain/adpaters/exception.interface';
import { CommonErrorCodeEnum } from '@domain/common/enum/error-code.enum';
import { PointLogActionEnum } from '@domain/common/enum/point-log-action.enum';
import { CreateOrderModel } from '@domain/model/database/order';
import { CreateOrderProductModel } from '@domain/model/database/order-product';
import { CreatePointLogModel } from '@domain/model/database/point-log';
import { IInventoryRepository } from '@domain/repositories/inventory.repository.interface';
import { IOrderProductRepository } from '@domain/repositories/order-product.repository.interface';
import { IOrderRepository } from '@domain/repositories/order.repository.interface';
import { IPointLogRepository } from '@domain/repositories/point-log.repository.interface';
import { IPointRepository } from '@domain/repositories/point.repository.interface';
import { IProductRepository } from '@domain/repositories/product.repository.interface';
import { AddOrderDto } from '@infra/controller/order/dto/add-order.dto';
import dayjs from 'dayjs';
import { EntityManager } from 'typeorm';

export class AddOrderUseCases {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly pointRepository: IPointRepository,
    private readonly pointLogRepository: IPointLogRepository,
    private readonly orderRepository: IOrderRepository,
    private readonly orderProductRepository: IOrderProductRepository,
    private readonly inventoryRepository: IInventoryRepository,
    private readonly exceptionService: IException,
  ) {}

  async execute(
    userId: number,
    pointId: number,
    data: AddOrderDto,
    conn: EntityManager,
  ) {
    const product = await this.checkProduct(data.productId);
    if (
      !product.inventory ||
      product.inventory.stock - product.inventory.selledStock < data.orderCount
    ) {
      throw this.exceptionService.forbiddenException({
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
        error_text: '재고가 없습니다.',
      });
    }

    const userPoint = await this.checkUserPoint(pointId);
    const totalPrice = product.price * data.orderCount;

    if (userPoint.point < totalPrice) {
      throw this.exceptionService.forbiddenException({
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
        error_text: '포인트 잔액이 부족하여 주문이 거절되었습니다.',
      });
    }

    const newOrder = new CreateOrderModel();
    newOrder.buyerId = userId;
    newOrder.orderDate = dayjs().toDate();
    newOrder.usePoint = totalPrice;

    const order = await this.createOrder(newOrder, conn);

    const newOrderProduct = new CreateOrderProductModel();
    newOrderProduct.orderId = order.id;
    newOrderProduct.productId = data.productId;
    newOrderProduct.orderCount = data.orderCount;
    newOrderProduct.price = product.price;

    await this.createOrderProduct(newOrderProduct, conn);
    await this.updatePoint(pointId, totalPrice, conn);
    await this.createPointLog(pointId, totalPrice, conn);
    await this.updateInventory(product.inventory.id, data.orderCount, conn);

    const result = await this.getOrderDetailById(order.id, conn);

    return result;
  }

  private async getOrderDetailById(orderId: number, conn: EntityManager) {
    const result = await this.orderRepository.findOneDetailById(orderId, conn);
    if (!result) {
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '주문 정보를 가져올 수 없습니다.',
      });
    }

    return result;
  }

  private async checkUserPoint(pointId: number) {
    const result = await this.pointRepository.findOneById(pointId);

    if (!result) {
      throw this.exceptionService.forbiddenException({
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
        error_text: '포인트 사용 권한이 없는 유저입니다.',
      });
    }

    return result;
  }

  private async checkProduct(productId: number) {
    const result = await this.productRepository.findOneByIdWithRelation(
      productId,
      {
        inventory: true,
      },
    );

    if (!result) {
      throw this.exceptionService.badRequestException({
        error_code: CommonErrorCodeEnum.INVALID_PARAM,
        error_text: 'id에 해당하는 상품이 없습니다.',
      });
    }

    return result;
  }

  private async createOrder(data: CreateOrderModel, conn: EntityManager) {
    try {
      const result = await this.orderRepository.create(data, conn);

      return result;
    } catch (err) {
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '주문 생성 실패',
      });
    }
  }

  private async createOrderProduct(
    data: CreateOrderProductModel,
    conn: EntityManager,
  ) {
    try {
      const result = await this.orderProductRepository.create(data, conn);

      return result;
    } catch (err) {
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '주문 상품 관계설정 실패',
      });
    }
  }

  private async updatePoint(
    pointId: number,
    usePoint: number,
    conn: EntityManager,
  ) {
    try {
      await this.pointRepository.substractPoint(pointId, usePoint, conn);
    } catch (err) {
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '포인트 차감 실패',
      });
    }
  }

  private async updateInventory(
    inventoryId: number,
    orderCount: number,
    conn: EntityManager,
  ) {
    try {
      await this.inventoryRepository.addSelledStock(
        inventoryId,
        orderCount,
        conn,
      );
    } catch (err) {
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '재고 변경 실패',
      });
    }
  }

  private async createPointLog(
    pointId: number,
    usePoint: number,
    conn: EntityManager,
  ) {
    const newPointLog = new CreatePointLogModel();
    newPointLog.pointId = pointId;
    newPointLog.addPoint = 0;
    newPointLog.usePoint = usePoint;
    newPointLog.content = '상품 포인트 결제';
    newPointLog.action = PointLogActionEnum.ORDER_PRODUCT;

    try {
      const result = await this.pointLogRepository.create(newPointLog, conn);

      return result;
    } catch (err) {
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '포인트 로그 작성 실패',
      });
    }
  }
}
