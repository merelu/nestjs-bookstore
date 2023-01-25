import { CommonErrorCodeEnum } from '@domain/common/enum/error-code.enum';
import { RoleEnum } from '@domain/common/enum/role.enum';
import { UserModelWithoutPassword } from '@domain/model/database/user';
import { AuthJwt } from '@infra/common/decorators/auth-jwt.decorator';
import { ApiResponseType } from '@infra/common/decorators/response.decorator';
import { Roles } from '@infra/common/decorators/roles.decorator';
import { User } from '@infra/common/decorators/user.decorator';
import { RolesGuard } from '@infra/common/guards/roles.guard';
import { ExceptionService } from '@infra/services/exception/exception.service';
import { UseCaseProxy } from '@infra/usecases-proxy/usecases-proxy';
import { UseCasesProxyModule } from '@infra/usecases-proxy/usecases-proxy.module';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AddOrderUseCases } from '@usecases/order/add-order.usecases';
import { CancelOrderUseCases } from '@usecases/order/cancel-order.usecases';
import { GetOrdersUseCases } from '@usecases/order/get-orders.usecases';
import { DataSource } from 'typeorm';
import { FormatException } from '../exception.format';
import { AddOrderDto } from './dto/add-order.dto';
import { OrderDetailPresenter } from './presenter/order.presenter';

@Controller('order')
@ApiTags('Order')
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
  type: FormatException,
})
@ApiExtraModels(OrderDetailPresenter)
export class OrderController {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(UseCasesProxyModule.ADD_ORDER_USECASES_PROXY)
    private readonly addOrderUseCasesProxy: UseCaseProxy<AddOrderUseCases>,
    @Inject(UseCasesProxyModule.GET_ORDERS_USECASES_PROXY)
    private readonly getOrdersUseCasesProxy: UseCaseProxy<GetOrdersUseCases>,
    @Inject(UseCasesProxyModule.CANCEL_ORDER_USECASES_PROXY)
    private readonly cancelOrderUseCasesProxy: UseCaseProxy<CancelOrderUseCases>,
    private readonly exceptionService: ExceptionService,
  ) {}

  @Post('')
  @ApiOperation({ summary: '주문' })
  @AuthJwt(RolesGuard)
  @Roles(RoleEnum.CUSTOMER)
  @ApiResponseType(OrderDetailPresenter)
  async addOrder(
    @User() user: UserModelWithoutPassword,
    @Body() data: AddOrderDto,
  ) {
    if (!user.pointId) {
      throw this.exceptionService.forbiddenException({
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
        error_text: '유저 포인트 정보가 없어서 주문 요청이 거절 되었습니다.',
      });
    }
    const connection = this.dataSource.createQueryRunner();
    await connection.connect();
    await connection.startTransaction();
    try {
      const result = await this.addOrderUseCasesProxy
        .getInstance()
        .execute(user.id, user.pointId, data, connection.manager);

      await connection.commitTransaction();

      return new OrderDetailPresenter(result);
    } catch (err) {
      await connection.rollbackTransaction();
      throw err;
    } finally {
      await connection.release();
    }
  }

  @Get('list')
  @ApiOperation({ summary: '내 주문 목록' })
  @AuthJwt(RolesGuard)
  @Roles(RoleEnum.CUSTOMER)
  @ApiResponseType(OrderDetailPresenter)
  async getOrdersByMe(@User() user: UserModelWithoutPassword) {
    const result = await this.getOrdersUseCasesProxy
      .getInstance()
      .getOrdersByBuyerId(user.id);

    return result.map((i) => new OrderDetailPresenter(i));
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: '주문 취소' })
  @AuthJwt(RolesGuard)
  @Roles(RoleEnum.CUSTOMER)
  @ApiResponseType(OrderDetailPresenter)
  async cancelOrder(
    @User() user: UserModelWithoutPassword,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    const connection = this.dataSource.createQueryRunner();
    await connection.connect();
    await connection.startTransaction();
    try {
      const result = await this.cancelOrderUseCasesProxy
        .getInstance()
        .execute(user.id, orderId, connection.manager);

      await connection.commitTransaction();

      return new OrderDetailPresenter(result);
    } catch (err) {
      await connection.rollbackTransaction();
      throw err;
    } finally {
      await connection.release();
    }
  }
}
