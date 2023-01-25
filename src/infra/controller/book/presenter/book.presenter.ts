import { BookModel, IBookModel } from '@domain/model/database/book';
import { AuthorPresenter } from '@infra/controller/author/presenter/author.presenter';
import { ApiProperty } from '@nestjs/swagger';

export class BaseBookPresenter implements IBookModel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  constructor(data: BookModel) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
  }
}

export class BookDetailPresenter extends BaseBookPresenter {
  @ApiProperty({ type: 'string', nullable: true })
  coverImageUrl?: string | null;

  @ApiProperty({ type: [AuthorPresenter] })
  authors?: (AuthorPresenter | null)[];

  constructor(data: BookModel) {
    super(data);
    this.coverImageUrl = data.coverImage?.url || null;
    this.authors = data.authorBooks
      ? data.authorBooks.map((i) => {
          return i.author ? new AuthorPresenter(i.author) : null;
        })
      : [];
  }
}
