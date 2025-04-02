import { Controller, Get, Post, Put, Delete, Body, Query, Headers, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateProductDto } from './products/dto/create-product.dto';
import { UpdateProductDto } from './products/dto/update-product.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LoginDto } from './auth/dto/login.dto';
import { TokenResponseDto } from './auth/dto/token.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Middleware-like token validation for all routes
  private async validateRequest(authHeader: string): Promise<void> {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
  
    const token = authHeader.split(' ')[1];
    if (!token || token === '') {
      throw new UnauthorizedException('Token is missing');
    }
  
    const isValid = await this.appService.validateToken(token);
    if (!isValid) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  // Auth Endpoints
  @ApiTags('auth')
  @ApiOperation({ summary: 'User login', description: 'Authenticate user and return JWT token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful', type: TokenResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('auth/login')
  async login(@Body() loginDto: LoginDto) {
    return this.appService.login(loginDto.username, loginDto.password);
  }

  @ApiTags('auth')
  @ApiOperation({ summary: 'Validate token', description: 'Check if token is valid' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Token is valid', schema: { 
    properties: { valid: { type: 'boolean' } } 
  }})
  @ApiResponse({ status: 401, description: 'Invalid token' })
  @Get('auth/validate')
  async validateToken(@Headers('Authorization') authHeader: string) {
    // Existing validation code
    const token = authHeader.split(' ')[1];
    const isValid = await this.appService.validateToken(token);
    return { valid: isValid };
  }

  // Product Endpoints
  @ApiTags('products')
  @ApiOperation({ summary: 'Get products', description: 'Retrieve paginated list of products' })
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'page', description: 'Page number', required: false, type: Number })
  @ApiQuery({ name: 'limit', description: 'Items per page', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of products' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('products')
  async getProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Headers('Authorization') authHeader: string,
  ) {
    await this.validateRequest(authHeader);
   
    return this.appService.getProducts(page, limit);
  }

  @ApiTags('products')
  @ApiOperation({ summary: 'Get product by ID', description: 'Retrieve a single product by ID' })
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'id', description: 'Product ID', required: true })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('product')
  async getProduct(@Query('id') id: string, @Headers('Authorization') authHeader: string) {
    await this.validateRequest(authHeader);
    return this.appService.getProduct(id);
  }

  @ApiTags('products')
  @ApiOperation({ summary: 'Create product', description: 'Add a new product' })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('product')
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Headers('Authorization') authHeader: string,
  ) {
    await this.validateRequest(authHeader);
    return this.appService.createProduct(createProductDto);
  }

  @ApiTags('products')
  @ApiOperation({ summary: 'Update product', description: 'Update an existing product' })
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'id', description: 'Product ID', required: true })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Put('product')
  async updateProduct(
    @Query('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Headers('Authorization') authHeader: string,
  ) {
    await this.validateRequest(authHeader);
    return this.appService.updateProduct(id, updateProductDto);
  }

  @ApiTags('products')
  @ApiOperation({ summary: 'Delete product', description: 'Remove a product' })
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'id', description: 'Product ID', required: true })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Delete('product')
  async deleteProduct(@Query('id') id: string, @Headers('Authorization') authHeader: string) {
    await this.validateRequest(authHeader);
    return this.appService.deleteProduct(id);
  }
}