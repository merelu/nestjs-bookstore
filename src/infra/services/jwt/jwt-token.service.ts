import { IJwtService } from '@domain/adpaters/jwt.interface';
import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class JwtTokenService implements IJwtService {
  constructor(private readonly jwtService: JwtService) {}

  //추후 token payload 타입 정의
  async checkToken(token: string, secret?: string, ignoreExp?: boolean) {
    const decode = await this.jwtService.verifyAsync(token, {
      secret,
      ignoreExpiration: ignoreExp,
    });
    return decode;
  }

  createToken(payload: any, secret: string, expiresIn?: string): string {
    return this.jwtService.sign(payload, {
      secret: secret,
      expiresIn: expiresIn,
    });
  }

  createTokenByOption(option: JwtSignOptions): string {
    return this.jwtService.sign({}, option);
  }
}
