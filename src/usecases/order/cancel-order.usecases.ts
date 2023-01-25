import { IException } from '@domain/adpaters/exception.interface';
import { CommonErrorCodeEnum } from '@domain/common/enum/error-code.enum';
import { OrderStateEnum } from '@domain/common/enum/order-state.enum';
import { IOrderRepository } from '@domain/repositories/order.repository.interface';
import { EntityManager } from 'typeorm';

export class CancelOrderUseCases {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly exceptionService: IException,
  ) {}

  async execute(userId: number, orderId: number, conn: EntityManager) {
    await this.checkOrder(userId, orderId);
    await this.updateOrderState(orderId, conn);

    const result = await this.getOrderDetail(orderId, conn);

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
}
