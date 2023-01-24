import { ApiProperty } from '@nestjs/swagger';

export class UploadCoverImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  image: Express.Multer.File;
}
