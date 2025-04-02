import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getModelToken } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let mockProductModel: any;

  beforeEach(async () => {
    mockProductModel = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const dto = { name: 'Test Product', price: 100 };
      const createdProduct = { ...dto, _id: '1' };
      mockProductModel.create.mockResolvedValue(createdProduct);

      const result = await service.create(dto as any);
      expect(result).toEqual(createdProduct);
      expect(mockProductModel.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return a list of products', async () => {
      const products = [{ name: 'Product 1', price: 100 }];
      mockProductModel.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(products),
      });

      const result = await service.findAll(1, 10);
      expect(result).toEqual(products);
      expect(mockProductModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product by ID', async () => {
      const product = { name: 'Product 1', price: 100 };
      mockProductModel.findById.mockResolvedValue(product);

      const result = await service.findOne('1');
      expect(result).toEqual(product);
      expect(mockProductModel.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductModel.findById.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product by ID', async () => {
      const updatedProduct = { name: 'Updated Product', price: 150 };
      mockProductModel.findByIdAndUpdate.mockResolvedValue(updatedProduct);

      const result = await service.update('1', updatedProduct as any);
      expect(result).toEqual(updatedProduct);
      expect(mockProductModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        updatedProduct,
        { new: true },
      );
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(service.update('1', {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a product by ID', async () => {
      mockProductModel.findByIdAndDelete.mockResolvedValue({});

      await expect(service.remove('1')).resolves.toBeUndefined();
      expect(mockProductModel.findByIdAndDelete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});