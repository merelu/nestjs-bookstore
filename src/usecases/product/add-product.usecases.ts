import { IException } from '@domain/adpaters/exception.interface';
import { CommonErrorCodeEnum } from '@domain/common/enum/error-code.enum';
import { CreateAuthorModel } from '@domain/model/database/author';
import { CreateAuthorBookModel } from '@domain/model/database/author-book';
import { CreateBookModel } from '@domain/model/database/book';
import { CreateInventoryModel } from '@domain/model/database/inventory';
import { CreateProductModel } from '@domain/model/database/product';
import { IAuthorBookRepository } from '@domain/repositories/author-book.repository.interface';
import { IAuthorRepository } from '@domain/repositories/author.repository.inteface';
import { IBookRepository } from '@domain/repositories/book.repository.interface';
import { ICoverImageRepository } from '@domain/repositories/cover-image.repository.interface';
import { IInventoryRepository } from '@domain/repositories/inventory.repository.interface';
import { IProductRepository } from '@domain/repositories/product.repository.interface';
import { AddProductDto } from '@infra/controller/product/dto/add-book.dto';
import { EntityManager } from 'typeorm';

export class AddProductUseCases {
  constructor(
    private readonly bookRepository: IBookRepository,
    private readonly authorRepository: IAuthorRepository,
    private readonly authorBookRepository: IAuthorBookRepository,
    private readonly productRepository: IProductRepository,
    private readonly inventoryRepository: IInventoryRepository,
    private readonly coverImageRepository: ICoverImageRepository,
    private readonly exceptionService: IException,
  ) {}

  async execute(userId: number, data: AddProductDto, conn: EntityManager) {
    await this.checkImage(userId, data.coverImageId);

    const newAuthor = new CreateAuthorModel();
    newAuthor.name = data.authorName;

    const author = await this.createAuthor(newAuthor, conn);

    const newBook = new CreateBookModel();
    newBook.name = data.bookName;
    newBook.description = data.bookDescription;
    newBook.coverImageId = data.coverImageId;

    const book = await this.createBook(newBook, conn);

    const newBookAuthor = new CreateAuthorBookModel();
    newBookAuthor.authorId = author.id;
    newBookAuthor.bookId = book.id;

    await this.createAuthorBook(newBookAuthor, conn);

    const newInventory = new CreateInventoryModel();
    newInventory.stock = data.stock;

    const inventory = await this.createInventory(newInventory, conn);

    const newProduct = new CreateProductModel();
    newProduct.bookId = book.id;
    newProduct.inventoryId = inventory.id;
    newProduct.sellerId = userId;
    newProduct.price = data.price;

    const product = await this.createProduct(newProduct, conn);

    const result = await this.getProductDetail(product.id, conn);

    return result;
  }

  private async checkImage(userId: number, coverImageId: number) {
    const result = await this.coverImageRepository.findOneByIdWithoutData(
      coverImageId,
    );
    if (!result) {
      throw this.exceptionService.badRequestException({
        error_code: CommonErrorCodeEnum.INVALID_PARAM,
        error_text: 'id에 해당하는 커버 이미지가 없습니다.',
      });
    }
    if (!result.uploaderId || result.uploaderId !== userId) {
      throw this.exceptionService.forbiddenException({
        error_code: CommonErrorCodeEnum.FORBIDDEN_REQUEST,
        error_text: '사용 권한이 없는 이미지 입니다.',
      });
    }
    return result;
  }

  private async getProductDetail(id: number, conn: EntityManager) {
    const result = await this.productRepository.findOneByIdWithDetail(id, conn);

    if (!result) {
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '알 수 없는 서버에러',
      });
    }
    return result;
  }

  private async createAuthor(data: CreateAuthorModel, conn: EntityManager) {
    try {
      const result = await this.authorRepository.create(data, conn);
      return result;
    } catch (err) {
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '작가 생성 실패',
      });
    }
  }

  private async createBook(data: CreateBookModel, conn: EntityManager) {
    try {
      const result = await this.bookRepository.create(data, conn);
      return result;
    } catch (err) {
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '책 생성 실패',
      });
    }
  }

  private async createAuthorBook(
    data: CreateAuthorBookModel,
    conn: EntityManager,
  ) {
    try {
      const result = await this.authorBookRepository.create(data, conn);
      return result;
    } catch (err) {
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '작가 책 관계설정 실패',
      });
    }
  }

  private async createInventory(
    data: CreateInventoryModel,
    conn: EntityManager,
  ) {
    try {
      const result = await this.inventoryRepository.create(data, conn);
      return result;
    } catch (err) {
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '재고 생성 실패',
      });
    }
  }

  private async createProduct(data: CreateProductModel, conn: EntityManager) {
    try {
      const result = await this.productRepository.create(data, conn);
      return result;
    } catch (err) {
      console.log(err);
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '상품 생성 실패',
      });
    }
  }
}
