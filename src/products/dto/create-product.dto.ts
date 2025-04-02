import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Bluetooth Headphones'
  })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Wireless headphones with noise cancellation'
  })
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: 59.99
  })
  price: number;

  @ApiProperty({
    description: 'Product category',
    example: 'Electronics'
  })
  category: string;

  @ApiProperty({
    description: 'Product stock quantity',
    example: 100
  })
  stock: number;
}