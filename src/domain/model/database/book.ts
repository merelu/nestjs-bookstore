import { PickType } from '@nestjs/mapped-types';
import { CommonModel } from '../common/common';

export interface IBookModel {
  id: number;
  name: string;
  description: string;
  coverImageId: number;
}

export class BookModel extends CommonModel implements IBookModel {
  name: string;
  description: string;
  coverImageId: number;
}

export class CreateBookModel extends PickType(BookModel, [
  'name',
  'description',
  'coverImageId',
]) {}

export class UpdateBookModel extends PickType(CreateBookModel, [
  'name',
  'description',
] as const) {}
