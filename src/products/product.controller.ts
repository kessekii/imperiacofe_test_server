import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern({ cmd: 'create_product' })
  async createProduct(@Payload() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @MessagePattern({ cmd: 'get_products' })
  async getProducts(@Payload() data: { page: number; limit: number }) {
    const { page, limit } = data;
    return this.productService.findAll(page, limit);
  }
  @MessagePattern({ cmd: 'get_products_amount' })
  async getProductsAmount() {

    return this.productService.findLength();
  }

  @MessagePattern({ cmd: 'get_product' })
  async getProduct(@Payload() id: string) {
    return this.productService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_product' })
  async updateProduct(@Payload() data: { id: string; updateProductDto: UpdateProductDto }) {
    const { id, updateProductDto } = data;
    return this.productService.update(id, updateProductDto);
  }

  @MessagePattern({ cmd: 'delete_product' })
  async deleteProduct(@Payload() id: string) {
    return this.productService.remove(id);
  }
}