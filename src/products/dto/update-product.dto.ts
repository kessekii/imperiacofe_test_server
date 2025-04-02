import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto){
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    stock?: number;
  }
