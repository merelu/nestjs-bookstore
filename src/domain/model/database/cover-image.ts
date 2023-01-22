import { PickType } from '@nestjs/mapped-types';
import { CommonModel } from '../common/common';

export interface ICoverImage {
  id: number;
  filename: string;
  data: Uint8Array;
}

export class CoverImageModel extends CommonModel implements ICoverImage {
  filename: string;
  data: Uint8Array;
}

export class CreateCoverImageModel extends PickType(CoverImageModel, [
  'filename',
  'data',
] as const) {}

export class UpdateCoverImageModel extends CreateCoverImageModel {}
