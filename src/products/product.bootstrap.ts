import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ProductModule } from './product.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ProductModule, {
    transport: Transport.TCP, // Use TCP transport for microservices
    options: {
      host: '127.0.0.1',
      port: 3001,
    },
  });

  await app.listen();
  console.log('Product microservice is running on port 3001');
}
bootstrap();