import { IException } from '@domain/adpaters/exception.interface';
import { CommonErrorCodeEnum } from '@domain/common/enum/error-code.enum';
import { OrderStateEnum } from '@domain/common/enum/order-state.enum';
import { PointLogActionEnum } from '@domain/common/enum/point-log-action.enum';
import { CreatePointLogModel } from '@domain/model/database/point-log';
import { IInventoryRepository } from '@domain/repositories/inventory.repository.interface';
import { IOrderRepository } from '@domain/repositories/order.repository.interface';
import { IPointLogRepository } from '@domain/repositories/point-log.repository.interface';
import { IPointRepository } from '@domain/repositories/point.repository.interface';
import { EntityManager } from 'typeorm';

export class CancelOrderUseCases {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly inventoryRepository: IInventoryRepository,
    private readonly pointRepository: IPointRepository,
    private readonly pointLogRepository: IPointLogRepository,
    private readonly exceptionService: IException,
  ) {}

  //refactoring need
  async execute(
    userId: number,
    pointId: number,
    orderId: number,
    conn: EntityManager,
  ) {
    await this.checkOrder(userId, orderId);
    await this.updateOrderState(orderId, conn);

    const result = await this.getOrderDetail(orderId, conn);
    if (!result.orderProducts) {
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '재고 수정 실패',
      });
    }
    await Promise.all(
      result.orderProducts.map(async (orderProduct) => {
        if (!orderProduct.product || !orderProduct.product.inventoryId) {
          throw this.exceptionService.internalServerErrorException({
            error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
            error_text: '재고 수정 실패',
          });
        }
        await this.updateInventory(
          orderProduct.product.inventoryId,
          orderProduct.orderCount,
          conn,
        );
      }),
    ).catch((err) => {
      throw err;
    });

    await this.refundPoint(pointId, result.usePoint, conn);

    return result;
  }

  private async checkOrder(userId: number, orderId: number) {
    const result = await this.orderRepository.findOneById(orderId);

    if (!result) {
      throw this.exceptionService.badRequestException({
        error_code: CommonErrorCodeEnum.INVALID_PARAM,
        error_text: '잘못된 id 입니다.',
      });
    }

    if (!result.buyerId || result.buyerId !== userId) {
      throw this.exceptionService.forbiddenException({
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
        error_text: '수정 권한이 없습니다.',
      });
    }

    return result;
  }

  private async updateOrderState(orderId: number, conn: EntityManager) {
    try {
      await this.orderRepository.updateOrderState(
        orderId,
        OrderStateEnum.CANCEL,
        conn,
      );
    } catch (err) {
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: 'orderState 변경 실패',
      });
    }
  }

  private async getOrderDetail(orderId: number, conn: EntityManager) {
    const result = await this.orderRepository.findOneDetailById(orderId, conn);

    if (!result) {
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '주문 정보를 가져올 수 없습니다.',
      });
    }
    return result;
  }

  private async updateInventory(
    inventoryId: number,
    stock: number,
    conn: EntityManager,
  ) {
    try {
      await this.inventoryRepository.substractSelledStock(
        inventoryId,
        stock,
        conn,
      );
    } catch (err) {
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '재고 수정 실패',
      });
    }
  }

  private async refundPoint(
    pointId: number,
    addPoint: number,
    conn: EntityManager,
  ) {
    await this.updatePoint(pointId, addPoint, conn);
    await this.createPointLog(pointId, addPoint, conn);
  }

  private async updatePoint(
    pointId: number,
    addPoint: number,
    conn: EntityManager,
  ) {
    try {
      await this.pointRepository.addPoint(pointId, addPoint, conn);
    } catch (err) {
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '포인트 환불 실패',
      });
    }
  }

  private async createPointLog(
    pointId: number,
    addPoint: number,
    conn: EntityManager,
  ) {
    const newPointLog = new CreatePointLogModel();
    newPointLog.pointId = pointId;
    newPointLog.addPoint = addPoint;
    newPointLog.usePoint = 0;
    newPointLog.content = '주문 취소 환불';
    newPointLog.action = PointLogActionEnum.ORDER_REFUND;

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
