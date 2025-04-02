import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const newProduct = new this.productModel(createProductDto);
      return await newProduct.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<Product[]> {
    try {
      const skip = (page - 1) * limit;
      return await this.productModel.find().skip(skip).limit(limit).exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch products');
    }
  }
  async findLength(): Promise<number> {
    try {
    
      const products = await this.productModel.countDocuments().exec();
      return products;
    }
    catch (error) {
      throw new InternalServerErrorException('Failed to fetch products length');
    }
  }
  async findOne(id: string): Promise<Product> {
    try {
      const product = await this.productModel.findById(id).exec();
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return product;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch product');
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(id, updateProductDto, { new: true })
        .exec();
      if (!updatedProduct) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return updatedProduct;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update product');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.productModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete product');
    }
  }
}