import { CommonErrorCodeEnum } from '@domain/common/enum/error-code.enum';
import { RoleEnum } from '@domain/common/enum/role.enum';
import { UserModelWithoutPassword } from '@domain/model/database/user';
import { AuthJwt } from '@infra/common/decorators/auth-jwt.decorator';
import { ApiResponseType } from '@infra/common/decorators/response.decorator';
import { Roles } from '@infra/common/decorators/roles.decorator';
import { User } from '@infra/common/decorators/user.decorator';
import { RolesGuard } from '@infra/common/guards/roles.guard';
import { ParseIntPipe } from '@infra/common/validation-pipe/parse-int.pipe';
import { UseCaseProxy } from '@infra/usecases-proxy/usecases-proxy';
import { UseCasesProxyModule } from '@infra/usecases-proxy/usecases-proxy.module';
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  Get,
  Inject,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AddCoverImageUseCases } from '@usecases/book/add-cover-image.usecases';
import { GetCoverImageUseCases } from '@usecases/book/get-cover-image.usecases';
import { UpdateCoverImageUseCases } from '@usecases/book/update-cover-image.usecases';
import { Response } from 'express';
import { Readable } from 'stream';
import { DataSource } from 'typeorm';
import { FormatException } from '../exception.format';
import { UploadCoverImageDto } from './dto/upload-cover-image.dto';
import { UploadCoverImagePresenter } from './presenter/upload-cover-image.presenter';

@Controller('book')
@ApiTags('Book')
@ApiInternalServerErrorResponse({
  description: '서버오류',
  type: FormatException,
})
@ApiBadRequestResponse({
  description: '요청 Param이 잘못됐을때',
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
    @Inject(UseCasesProxyModule.UPDATE_COVER_IMAGE_USECASES_PROXY)
    private readonly updateCoverImageUseCasesProxy: UseCaseProxy<UpdateCoverImageUseCases>,
  ) {}

  @Post('cover')
  @AuthJwt(RolesGuard)
  @Roles(RoleEnum.SELLER)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '커버이미지 업로드(Seller)',
    description: 'Content-type : multipart/form-data',
  })
  @ApiBody({ type: UploadCoverImageDto })
  @UseInterceptors(FileInterceptor('image'))
  @ApiResponseType(UploadCoverImagePresenter)
  async uploadCoverImage(
    @User() user: UserModelWithoutPassword,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png)$/,
          }),
        ],
        exceptionFactory: (error) =>
          new BadRequestException({
            error_code: CommonErrorCodeEnum.INVALID_PARAM,
            error_text: error,
          }),
      }),
    )
    image: Express.Multer.File,
  ) {
    const connection = this.dataSource.createQueryRunner();
    await connection.connect();
    await connection.startTransaction();
    try {
      const result = await this.addCoverImageUseCasesProxy
        .getInstance()
        .execute(user.id, image.originalname, image.buffer, connection.manager);

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
    summary: '이미지 확인(Public)',
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

  @Patch(':id/cover')
  @ApiOperation({
    summary: '책 커버 이미지 수정(Seller)',
  })
  @AuthJwt(RolesGuard)
  @Roles(RoleEnum.SELLER)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadCoverImageDto })
  @UseInterceptors(FileInterceptor('image'))
  @ApiResponseType(UploadCoverImagePresenter)
  @ApiForbiddenResponse({
    description: '수정 권한이 없을때',
    type: FormatException,
  })
  async updateCoverImage(
    @User() user: UserModelWithoutPassword,
    @Param('id', ParseIntPipe) bookId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png)$/,
          }),
        ],
        exceptionFactory: (error) =>
          new BadRequestException({
            error_code: CommonErrorCodeEnum.INVALID_PARAM,
            error_text: error,
          }),
      }),
    )
    image: Express.Multer.File,
  ) {
    const connection = this.dataSource.createQueryRunner();
    await connection.connect();
    await connection.startTransaction();
    try {
      const result = await this.updateCoverImageUseCasesProxy
        .getInstance()
        .execute(
          user.id,
          bookId,
          image.originalname,
          image.buffer,
          connection.manager,
        );

      await connection.commitTransaction();
      return new UploadCoverImagePresenter(result);
    } catch (err) {
      await connection.rollbackTransaction();
      throw err;
    } finally {
      await connection.release();
    }
  }
}
