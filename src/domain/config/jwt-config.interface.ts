export interface IJwtConfig {
  getJwtSecret(): string;
  getJwtExpirationTime(): number;

  getJwtRefreshSecret(): string;
  getJwtRefreshExpirationTime(): number;
}
