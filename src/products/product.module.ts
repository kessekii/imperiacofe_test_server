import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
  imports: [
        MongooseModule.forRoot(
          "mongodb+srv://hammep:5omrshCmX9qOxTT5@cluster0.axazq6i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        ),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}