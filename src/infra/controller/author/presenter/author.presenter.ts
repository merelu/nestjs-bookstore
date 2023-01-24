import { AuthorModel, IAuthorModel } from '@domain/model/database/author';
import { ApiProperty } from '@nestjs/swagger';

export class AuthorPresenter implements IAuthorModel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  constructor(data: AuthorModel) {
    this.id = data.id;
    this.name = data.name;
  }
}
