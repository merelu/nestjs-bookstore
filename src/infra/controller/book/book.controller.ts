import { RoleEnum } from '@domain/common/enum/role.enum';
import { AuthJwt } from '@infra/common/decorators/auth-jwt.decorator';
import { ApiResponseType } from '@infra/common/decorators/response.decorator';
import { Roles } from '@infra/common/decorators/roles.decorator';
import { RolesGuard } from '@infra/common/guards/roles.guard';
import { UseCaseProxy } from '@infra/usecases-proxy/usecases-proxy';
import { UseCasesProxyModule } from '@infra/usecases-proxy/usecases-proxy.module';
import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AddCoverImageUseCases } from '@usecases/book/add-cover-image.usecases';
import { GetCoverImageUseCases } from '@usecases/book/get-cover-image.usecases';
import { Response } from 'express';
import { Readable } from 'stream';
import { DataSource } from 'typeorm';
import { FormatException } from '../exception.format';
import { UploadCoverImageDto } from './dto/upload-cover-image.dto';
import { UploadCoverImagePresenter } from './presenter/upload-cover-image.presenter';

@Controller('book')
@ApiTags('Book')
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
  type: FormatException,
})
@ApiExtraModels(UploadCoverImagePresenter)
export class BookController {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(UseCasesProxyModule.ADD_COVER_IMAGE_USECASES_PROXY)
    private readonly addCoverImageUseCasesProxy: UseCaseProxy<AddCoverImageUseCases>,
    @Inject(UseCasesProxyModule.GET_COVER_IMAGE_USECASES_PROXY)
    private readonly getCoverImageUseCasesProxy: UseCaseProxy<GetCoverImageUseCases>,
  ) {}

  @Post('cover')
  @AuthJwt(RolesGuard)
  @Roles(RoleEnum.SELLER)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '커버이미지 업로드',
    description: 'Content-type : multipart/form-data',
  })
  @ApiBody({ type: UploadCoverImageDto })
  @UseInterceptors(FileInterceptor('image'))
  @ApiResponseType(UploadCoverImagePresenter)
  async uploadCoverImage(@UploadedFile() image: Express.Multer.File) {
    const connection = this.dataSource.createQueryRunner();
    await connection.connect();
    await connection.startTransaction();
    try {
      const result = await this.addCoverImageUseCasesProxy
        .getInstance()
        .execute(image.originalname, image.buffer, connection.manager);

      await connection.commitTransaction();
      return new UploadCoverImagePresenter(result);
    } catch (err) {
      await connection.rollbackTransaction();
      throw err;
    } finally {
      await connection.release();
    }
  }

  @Get('cover/:id')
  @ApiOperation({
    summary: '이미지 확인',
    description:
      'id(coverImageId)에 해당하는 이미지를 보내줍니다. 예시) {baseURL}/book/cover/:id',
  })
  async readCoverImage(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.getCoverImageUseCasesProxy
      .getInstance()
      .execute(id);

    const stream = Readable.from(result.data);

    res.set({
      'Content-Disposition': `inline; filename="${result.filename}"`,
      'Content-Type': 'image',
    });

    return new StreamableFile(stream);
  }
}
