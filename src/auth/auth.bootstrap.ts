import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
    transport: Transport.TCP, // Use TCP transport for microservices
    options: {
      host: '127.0.0.1',
      port: 3002,
    },
  });

  await app.listen();
  console.log('Auth microservice is running on port 3002');
}
bootstrap();