import { IProductModel, ProductModel } from '@domain/model/database/product';
import { SellerPresenter } from '@infra/controller/user/presenter/user.presenter';
import { ApiProperty } from '@nestjs/swagger';
import { BookDetailPresenter } from '@infra/controller/book/presenter/book.presenter';
import { InventoryPresenter } from '@infra/controller/inventory/presenter/inventory.presenter';

export class BaseProductPresenter implements IProductModel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  price: number;

  constructor(data: ProductModel) {
    this.id = data.id;
    this.price = data.price;
  }
}

export class ProductDetailPresenter extends BaseProductPresenter {
  @ApiProperty({ type: SellerPresenter, nullable: true })
  seller?: SellerPresenter | null;

  @ApiProperty({ type: BookDetailPresenter, nullable: true })
  book?: BookDetailPresenter | null;

  @ApiProperty({ type: InventoryPresenter, nullable: true })
  inventory?: InventoryPresenter | null;

  constructor(data: ProductModel) {
    super(data);
    this.seller = data.seller ? new SellerPresenter(data.seller) : null;
    this.book = data.book ? new BookDetailPresenter(data.book) : null;
    this.inventory = data.inventory
      ? new InventoryPresenter(data.inventory)
      : null;
  }
}
