import { CoverImageModel } from '@domain/model/database/cover-image';
import { ApiProperty } from '@nestjs/swagger';

export class UploadCoverImagePresenter {
  @ApiProperty()
  id: number;

  @ApiProperty()
  filename: string;

  @ApiProperty({ type: 'string', nullable: true })
  url: string | null;

  constructor(data: CoverImageModel) {
    this.id = data.id;
    this.filename = data.filename;
    this.url = data.url ? data.url : null;
  }
}
