import { JwtSignOptions } from '@nestjs/jwt';

export interface IJwtPayload {
  sub: number;
}

export interface IJwtService {
  checkToken(
    token: string,
    secret?: string,
    ignoreExp?: boolean,
  ): Promise<IJwtPayload>;

  createToken(payload: IJwtPayload, secret: string, expiresIn?: string): string;

  createTokenByOption(option: JwtSignOptions): string;
}
