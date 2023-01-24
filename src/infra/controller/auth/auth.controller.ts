import { RoleEnum } from '@domain/common/enum/role.enum';
import { BaseResponseFormat } from '@domain/model/common/response';
import { UserModelWithoutPassword } from '@domain/model/database/user';
import { AuthJwt } from '@infra/common/decorators/auth-jwt.decorator';
import { AuthLogin } from '@infra/common/decorators/auth-local.decorator';
import { ApiResponseType } from '@infra/common/decorators/response.decorator';
import { Roles } from '@infra/common/decorators/roles.decorator';
import { User } from '@infra/common/decorators/user.decorator';
import { RolesGuard } from '@infra/common/guards/roles.guard';
import { UseCaseProxy } from '@infra/usecases-proxy/usecases-proxy';
import { UseCasesProxyModule } from '@infra/usecases-proxy/usecases-proxy.module';
import { Body, Controller, Get, Inject, Post, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LoginUseCases } from '@usecases/auth/login.usecases';
import { SignupUseCases } from '@usecases/auth/signup.usecases';
import { Response } from 'express';
import { DataSource } from 'typeorm';
import { FormatException } from '../exception.format';
import { BaseUserPresenter } from '../user/presenter/user.presenter';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
@ApiTags('Auth')
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
  type: FormatException,
})
@ApiExtraModels(FormatException, BaseUserPresenter)
export class AuthController {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(UseCasesProxyModule.SIGNUP_USECASES_PROXY)
    private readonly signupUseCasesProxy: UseCaseProxy<SignupUseCases>,
    @Inject(UseCasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUseCasesProxy: UseCaseProxy<LoginUseCases>,
  ) {}

  @Post('signup')
  @ApiOperation({ description: '화원 가입' })
  @ApiBadRequestResponse({
    description: '요청 값이 잘못되었거나, 이메일이 중복됐을때',
    type: FormatException,
  })
  @ApiResponseType()
  async signup(@Body() signupDto: SignupDto): Promise<BaseResponseFormat> {
    const connection = this.dataSource.createQueryRunner();
    await connection.connect();
    await connection.startTransaction();
    try {
      await this.signupUseCasesProxy
        .getInstance()
        .execute(signupDto, connection.manager);
      await connection.commitTransaction();
      return 'Success';
    } catch (err) {
      await connection.rollbackTransaction();
      throw err;
    } finally {
      await connection.release();
    }
  }

  @Post('login')
  @AuthLogin()
  @ApiBody({ type: LoginDto })
  @ApiOperation({ description: '로그인(이메일, 비밀번호)' })
  @ApiResponseType(BaseUserPresenter)
  async login(
    @User() user: UserModelWithoutPassword,
    @Res({ passthrough: true }) res: Response,
  ): Promise<BaseResponseFormat> {
    const useCase = this.loginUseCasesProxy.getInstance();

    const retAccess = useCase.getJwtTokenAndCookie(user.id);

    const retRefresh = await useCase.getJwtRefreshTokenAndCookie(user.id);

    res.setHeader('Set-Cookie', [retAccess.cookie, retRefresh.cookie]);

    return new BaseUserPresenter(user);
  }

  @Get('rolecheck')
  @AuthJwt(RolesGuard)
  @Roles(RoleEnum.SELLER)
  async roleCheck() {
    return 'success';
  }
}
