import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Application');

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // process validation decorators when a request comes in
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  const port = 3000;

  await app.listen(port);

  logger.log(`Application listening on ${port}`);
}
bootstrap();
