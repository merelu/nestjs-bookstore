import { PickType } from '@nestjs/mapped-types';
import { CommonModel } from '../common/common';
import { AuthorModel } from './author';
import { BookModel } from './book';

export interface IAuthorBookModel {
  id: number;
  authorId?: number;
  bookId?: number;
}

export class AuthorBookModel extends CommonModel implements IAuthorBookModel {
  authorId?: number;
  author?: AuthorModel;
  bookId?: number;
  book?: BookModel;
}

export class CreateAuthorBookModel extends PickType(AuthorBookModel, [
  'authorId',
  'bookId',
] as const) {}
