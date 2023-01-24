import { PickType } from '@nestjs/swagger';
import { CommonModel } from '../common/common';
import { AuthorBookModel } from './author-book';

export interface IAuthorModel {
  id: number;
  name: string;
}

export class AuthorModel extends CommonModel implements IAuthorModel {
  name: string;
  authorBooks?: AuthorBookModel[];
}

export class CreateAuthorModel extends PickType(AuthorModel, [
  'name',
] as const) {}

export class UpdateAuthorModel extends CreateAuthorModel {}
