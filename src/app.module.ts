import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule} from './products/product.module';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ProductModule,
    ConfigModule.forRoot(),

    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE', // Register the Product Microservice
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1', // Host of the Product Microservice
          port: 3001, // Port where the Product Microservice is running
        },
      },
      {
        name: 'AUTH_SERVICE', // Register the Auth Microservice
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1', // Host of the Auth Microservice
          port: 3002, // Port where the Auth Microservice is running
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}