import { IException } from '@domain/adpaters/exception.interface';
import { IRedisCacheService } from '@domain/adpaters/redis-cache.interface';
import { CommonErrorCodeEnum } from '@domain/common/enum/error-code.enum';

export class LogoutUseCases {
  constructor(
    private readonly redisCacheService: IRedisCacheService,
    private readonly exceptionService: IException,
  ) {}

  async execute(userId: number): Promise<string[]> {
    try {
      await this.redisCacheService.del('refresh' + userId);
    } catch (err) {
      throw this.exceptionService.internalServerErrorException({
        error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
        error_text: '로그아웃 실패',
      });
    }

    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
}
