import { OrderStateEnum } from '@domain/common/enum/order-state.enum';
import { IOrderModel, OrderModel } from '@domain/model/database/order';
import { BuyerPresenter } from '@infra/controller/user/presenter/user.presenter';
import { ApiProperty } from '@nestjs/swagger';
import { OrderProductPresenter } from './order-product.presenter';

export class BaseOrderPresenter implements IOrderModel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  orderState: OrderStateEnum;

  @ApiProperty()
  usePoint: number;

  @ApiProperty()
  orderDate: Date;

  constructor(data: OrderModel) {
    this.id = data.id;
    this.orderState = data.orderState;
    this.usePoint = data.usePoint;
    this.orderDate = data.orderDate;
  }
}

export class OrderDetailPresenter extends BaseOrderPresenter {
  @ApiProperty({ type: BuyerPresenter, nullable: true })
  buyer?: BuyerPresenter | null;

  @ApiProperty({ type: [OrderProductPresenter] })
  orderProducts?: OrderProductPresenter[] | null;

  constructor(data: OrderModel) {
    super(data);

    this.buyer = data.buyer ? new BuyerPresenter(data.buyer) : null;
    this.orderProducts = data.orderProducts
      ? data.orderProducts.map(
          (orderProduct) => new OrderProductPresenter(orderProduct),
        )
      : null;
  }
}
