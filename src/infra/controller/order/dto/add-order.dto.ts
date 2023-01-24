import { ApiProperty } from '@nestjs/swagger';

export class AddOrderDto {
  @ApiProperty()
  orderCount: number;

  @ApiProperty()
  productId: number;
}
