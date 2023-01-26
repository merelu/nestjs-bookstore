import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
@ApiTags('HealthCheck')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @ApiOperation({ summary: '서버 상태 체크' })
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('swagger', 'http://localhost:3001/doc'),
      () => this.db.pingCheck('typeorm'),
      () => this.memory.checkHeap('memory_heap', 80 * 1024 * 1024),
    ]);
  }
}
