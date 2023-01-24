import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';

export class AddProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  authorName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  bookName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bookDescription: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  coverImageId: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  stock: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  price: number;
}
