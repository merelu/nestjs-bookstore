import { CoverImageModel } from '@domain/model/database/cover-image';
import { ApiProperty } from '@nestjs/swagger';

export class UploadCoverImagePresenter {
  @ApiProperty()
  id: number;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  url: string | null;

  constructor(data: CoverImageModel) {
    this.id = data.id;
    this.filename = data.filename;
    this.url = data.url ? data.url : null;
  }
}
