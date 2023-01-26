import { Controller, Get, Post } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

@Controller('user')
@ApiTags('User')
@ApiResponse({ status: 500, description: '서버오류' })
@ApiExtraModels()
export class UserController {
  constructor(private readonly dataSource: DataSource) {}
}
