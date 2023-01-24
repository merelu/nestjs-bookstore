import { RoleEnum } from '@domain/common/enum/role.enum';
import { UserModelWithoutPassword } from '@domain/model/database/user';
import { AuthJwt } from '@infra/common/decorators/auth-jwt.decorator';
import { ApiResponseType } from '@infra/common/decorators/response.decorator';
import { Roles } from '@infra/common/decorators/roles.decorator';
import { User } from '@infra/common/decorators/user.decorator';
import { RolesGuard } from '@infra/common/guards/roles.guard';
import { UseCaseProxy } from '@infra/usecases-proxy/usecases-proxy';
import { UseCasesProxyModule } from '@infra/usecases-proxy/usecases-proxy.module';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AddOrderUseCases } from '@usecases/order/add-order.usecases';
import { DataSource } from 'typeorm';
import { FormatException } from '../exception.format';
import { AddOrderDto } from './dto/add-order.dto';

@Controller('order')
@ApiTags('Order')
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
  type: FormatException,
})
@ApiExtraModels()
export class OrderController {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(UseCasesProxyModule.ADD_ORDER_USECASES_PROXY)
    private readonly addOrderUseCasesProxy: UseCaseProxy<AddOrderUseCases>,
  ) {}

  @Post('')
  @ApiOperation({ summary: '주문 요청' })
  @AuthJwt(RolesGuard)
  @Roles(RoleEnum.CUSTOMER, RoleEnum.SELLER)
  @ApiResponseType()
  async addOrder(
    @User() user: UserModelWithoutPassword,
    @Body() data: AddOrderDto,
  ) {
    const connection = this.dataSource.createQueryRunner();
    await connection.connect();
    await connection.startTransaction();
    try {
      const result = await this.addOrderUseCasesProxy
        .getInstance()
        .execute(user.id, user.pointId, data, connection.manager);
      console.log(result);
      await connection.commitTransaction();

      return 'Success';
    } catch (err) {
      await connection.rollbackTransaction();
      throw err;
    } finally {
      await connection.release();
    }
  }
}
