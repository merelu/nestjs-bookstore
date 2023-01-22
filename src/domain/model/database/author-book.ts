import { PickType } from '@nestjs/mapped-types';
import { CommonModel } from '../common/common';

export interface IAuthorBookModel {
  id: number;
  authorId: number;
  bookId: number;
}

export class AuthorBookModel extends CommonModel implements IAuthorBookModel {
  authorId: number;
  bookId: number;
}

export class CreateAuthorBookModel extends PickType(AuthorBookModel, [
  'authorId',
  'bookId',
] as const) {}
