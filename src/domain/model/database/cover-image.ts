import { PickType } from '@nestjs/mapped-types';
import { CommonModel } from '../common/common';

export interface ICoverImage {
  id: number;
  filename: string;
  data: Uint8Array;
  url?: string;
}

export class CoverImageModel extends CommonModel implements ICoverImage {
  filename: string;
  data: Uint8Array;
  url?: string;
}

export class CreateCoverImageModel extends PickType(CoverImageModel, [
  'filename',
  'data',
  'url',
] as const) {}

export class UpdateCoverImageModel extends CreateCoverImageModel {}
