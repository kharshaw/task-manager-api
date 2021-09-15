import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const environment: string = process.env.ENVIRONMENT;

  const logger = new Logger('Application');

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.enableCors();

  // process validation decorators when a request comes in
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  const port = process.env.API_PORT || '3001';

  await app.listen(port);

  logger.log(
    `Application listening on port: ${port}; ENVIRONMENT: ${environment}`,
  );
}
bootstrap();
