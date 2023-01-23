import { Controller, Get, Post } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

@Controller('user')
@ApiTags('User')
@ApiResponse({ status: 500, description: 'Internal server error' })
@ApiExtraModels()
export class UserController {
  constructor(private readonly dataSource: DataSource) {}
}
