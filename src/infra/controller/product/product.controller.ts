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
  Post,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AddProductUseCases } from '@usecases/product/add-product.usecases';
import { CheckInventoryUseCases } from '@usecases/product/check-inventory.usecases';
import { DataSource } from 'typeorm';
import { FormatException } from '../exception.format';
import { InventoryPresenter } from '../inventory/presenter/inventory.presenter';
import { AddProductDto } from './dto/add-book.dto';
import { ProductDetailPresenter } from './presenter/product.presenter';

@Controller('product')
@ApiTags('Product')
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
  type: FormatException,
})
@ApiExtraModels(ProductDetailPresenter)
export class ProductController {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(UseCasesProxyModule.ADD_PRODUCT_USECASES_PROXY)
    private readonly addProductUseCasesProxy: UseCaseProxy<AddProductUseCases>,
    @Inject(UseCasesProxyModule.CHECK_INVENTORY_USECASES_PROXY)
    private readonly checkInventoryUseCasesProxy: UseCaseProxy<CheckInventoryUseCases>,
    private readonly exceptionService: ExceptionService,
  ) {}

  @Get(':id/inventory')
  @ApiOperation({ summary: '상품 재고 확인 (판매자용)' })
  @AuthJwt(RolesGuard)
  @Roles(RoleEnum.SELLER)
  @ApiResponseType(InventoryPresenter)
  async checkInventory(
    @User() user: UserModelWithoutPassword,
    @Param('id', ParseIntPipe) productId: number,
  ) {
    const result = await this.checkInventoryUseCasesProxy
      .getInstance()
      .execute(user.id, productId);

    if (!result.inventory) {
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '재고 정보가 없습니다.',
      });
    }

    return new InventoryPresenter(result.inventory);
  }

  @Post('')
  @ApiOperation({ summary: '상품 판매 등록' })
  @AuthJwt(RolesGuard)
  @Roles(RoleEnum.SELLER)
  @ApiResponseType(ProductDetailPresenter)
  async addProduct(
    @User() user: UserModelWithoutPassword,
    @Body() data: AddProductDto,
  ) {
    const connection = this.dataSource.createQueryRunner();
    await connection.connect();
    await connection.startTransaction();
    try {
      const result = await this.addProductUseCasesProxy
        .getInstance()
        .execute(user.id, data, connection.manager);
      await connection.commitTransaction();

      return new ProductDetailPresenter(result);
    } catch (err) {
      await connection.rollbackTransaction();
      throw err;
    } finally {
      await connection.release();
    }
  }
}
