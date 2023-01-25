import {
  IOrderProductModel,
  OrderProductModel,
} from '@domain/model/database/order-product';
import { ProductDetailPresenter } from '@infra/controller/product/presenter/product.presenter';
import { ApiProperty } from '@nestjs/swagger';

export class OrderProductPresenter implements IOrderProductModel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  orderCount: number;

  @ApiProperty()
  price: number;

  @ApiProperty({ type: ProductDetailPresenter, nullable: true })
  product?: ProductDetailPresenter | null;

  constructor(data: OrderProductModel) {
    this.id = data.id;
    this.orderCount = data.orderCount;
    this.price = data.price;
    this.product = data.product
      ? new ProductDetailPresenter(data.product)
      : null;
  }
}
