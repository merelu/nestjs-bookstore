import { PickType } from '@nestjs/mapped-types';
import { CommonModel } from '../common/common';
import { BookModel } from './book';
import { UserModel } from './user';

export interface ICoverImage {
  id: number;
  filename: string;
  data: Uint8Array;
  url?: string;

  uploaderId?: number;
}

export class CoverImageModel extends CommonModel implements ICoverImage {
  filename: string;
  book?: BookModel;
  data: Uint8Array;
  url?: string;
  uploaderId?: number;
  uploader?: UserModel;
}

export class CreateCoverImageModel extends PickType(CoverImageModel, [
  'filename',
  'uploaderId',
  'data',
  'url',
] as const) {}

export class UpdateCoverImageModel extends CreateCoverImageModel {}
