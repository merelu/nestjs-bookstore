import { IException } from '@domain/adpaters/exception.interface';
import { CommonErrorCodeEnum } from '@domain/common/enum/error-code.enum';
import { IOrderRepository } from '@domain/repositories/order.repository.interface';

export class GetOrdersUseCases {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly exceptionService: IException,
  ) {}

  async getOrdersByBuyerId(buyerId: number) {
    try {
      const result = await this.orderRepository.findByBuyerId(buyerId);

      return result;
    } catch (err) {
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '주문 목록을 가져오는데 실패 했습니다.',
      });
    }
  }
}
