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
import { AddProductUseCases } from '@usecases/product/add-product.usecases';
import { DataSource } from 'typeorm';
import { FormatException } from '../exception.format';
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
  ) {}

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
