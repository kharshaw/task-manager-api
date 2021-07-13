import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // process validation decorators when a request comes in
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
