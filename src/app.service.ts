import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProductDto } from './products/dto/create-product.dto';
import { UpdateProductDto } from './products/dto/update-product.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly productClient: ClientProxy, // Product Microservice
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy, // Auth Microservice
  ) {}
  async login(username: string, password: string): Promise<any> {
    return this.authClient.send({ cmd: 'login' }, { username, password }).toPromise();
  }

  async validateToken(token: string): Promise<boolean> {
    return this.authClient.send({ cmd: 'validate_token' }, { token }).toPromise();
  }
  // Product Microservice Methods
  async getProducts(page: number, limit: number): Promise<any> {
    return this.productClient.send({ cmd: 'get_products' }, { page, limit }).toPromise();
  }
  async getProductsAmount(): Promise<any> {
    return this.productClient.send({ cmd: 'get_products_amount' }, {}).toPromise();
  }
  async getProduct(id: string): Promise<any> {
    return this.productClient.send({ cmd: 'get_product' }, id).toPromise();
  }

  async createProduct(createProductDto: CreateProductDto): Promise<any> {
    return this.productClient.send({ cmd: 'create_product' }, createProductDto).toPromise();
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<any> {
    return this.productClient.send({ cmd: 'update_product' }, { id, updateProductDto }).toPromise();
  }

  async deleteProduct(id: string): Promise<any> {
    return this.productClient.send({ cmd: 'delete_product' }, id).toPromise();
  }
}