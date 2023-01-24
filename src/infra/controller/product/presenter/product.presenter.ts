import { IProductModel, ProductModel } from '@domain/model/database/product';
import { BaseUserPresenter } from '@infra/controller/user/presenter/user.presenter';
import { ApiProperty } from '@nestjs/swagger';
import { BookDetailPresenter } from '@infra/controller/book/presenter/book.presenter';
import { InventoryPresenter } from '@infra/controller/inventory/presenter/inventory.presenter';

export class BaseProductPresenter implements IProductModel {
  @ApiProperty()
  id: number;

  @ApiProperty({ nullable: true })
  bookId?: number;

  @ApiProperty()
  price: number;

  @ApiProperty({ nullable: true })
  inventoryId?: number;

  @ApiProperty({ nullable: true })
  sellerId?: number;

  constructor(data: ProductModel) {
    this.id = data.id;
    this.bookId = data.bookId;
    this.price = data.price;
    this.inventoryId = data.inventoryId;
    this.sellerId = data.sellerId;
  }
}

export class ProductDetailPresenter extends BaseProductPresenter {
  @ApiProperty({ type: BaseUserPresenter, nullable: true })
  seller?: BaseUserPresenter | null;

  @ApiProperty({ type: BookDetailPresenter, nullable: true })
  book?: BookDetailPresenter | null;

  @ApiProperty({ type: InventoryPresenter, nullable: true })
  inventory?: InventoryPresenter | null;

  constructor(data: ProductModel) {
    super(data);
    this.seller = data.seller ? new BaseUserPresenter(data.seller) : null;
    this.book = data.book ? new BookDetailPresenter(data.book) : null;
    this.inventory = data.inventory
      ? new InventoryPresenter(data.inventory)
      : null;
  }
}
