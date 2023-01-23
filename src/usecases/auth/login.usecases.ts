import { IBcryptService } from '@domain/adpaters/bcrypt.interface';
import { IJwtService, IJwtPayload } from '@domain/adpaters/jwt.interface';
import { IRedisCacheService } from '@domain/adpaters/redis-cache.interface';
import { IJwtConfig } from '@domain/config/jwt-config.interface';
import { IUserRepository } from '@domain/repositories/user.repository.interface';

export class LoginUseCases {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly bcryptService: IBcryptService,
    private readonly jwtConfig: IJwtConfig,
    private readonly jwtService: IJwtService,
    private readonly redisCacheService: IRedisCacheService,
  ) {}

  getJwtTokenAndCookie(userId: number) {
    const payload: IJwtPayload = { sub: userId };

    const secret = this.jwtConfig.getJwtSecret();
    const expiresIn = this.jwtConfig.getJwtExpirationTime() + 's';

    const token = this.jwtService.createToken(payload, secret, expiresIn);

    return {
      token,
      cookie: `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.jwtConfig.getJwtExpirationTime()}`,
    };
  }

  async getJwtRefreshTokenAndCookie(userId: number) {
    const payload: IJwtPayload = {
      sub: userId,
    };

    const secret = this.jwtConfig.getJwtRefreshSecret();
    const expiresIn = this.jwtConfig.getJwtRefreshExpirationTime() + 's';
    const token = this.jwtService.createToken(payload, secret, expiresIn);
    const tokenSigniture = token.split('.')[2];
    await this.setCurrentRefreshTokenHash(tokenSigniture, userId);

    return {
      token,
      cookie: `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.jwtConfig.getJwtRefreshExpirationTime()}`,
    };
  }

  async validateUserForLocalStrategy(email: string, password: string) {
    const user = await this.userRepository.findOneByEmail(email);

    if (!user) {
      return null;
    }

    const match = await this.bcryptService.compare(password, user.password);

    if (user && match) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateUserForJwtStrategy(userId: number) {
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      return null;
    }
    return user;
  }

  async compareRefreshTokenHash(
    userId: number,
    signiture: string,
  ): Promise<boolean> {
    const matchedHash = await this.redisCacheService.get('refresh' + userId);

    if (!matchedHash) return false;

    const isValid = await this.bcryptService.compare(signiture, matchedHash);

    if (!isValid) {
      return false;
    }
    return true;
  }

  private async setCurrentRefreshTokenHash(signiture: string, userId: number) {
    const hashedKey = await this.bcryptService.hash(signiture);
    await this.redisCacheService.set(
      'refresh' + userId,
      hashedKey,
      Number(this.jwtConfig.getJwtRefreshExpirationTime()),
    );
  }
}
