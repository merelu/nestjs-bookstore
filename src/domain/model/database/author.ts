import { PickType } from '@nestjs/swagger';
import { CommonModel } from '../common/common';

export interface IAuthorModel {
  id: number;
  name: string;
}

export class AuthorModel extends CommonModel implements IAuthorModel {
  name: string;
}

export class CreateAuthorModel extends PickType(AuthorModel, [
  'name',
] as const) {}

export class UpdateAuthorModel extends CreateAuthorModel {}
