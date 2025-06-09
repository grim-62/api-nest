import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configDotenv } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
configDotenv()
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips non-whitelisted properties
      forbidNonWhitelisted: true, // throws error if extra fields
      transform: true, // auto-transform payloads to DTO classes
    })
  )
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
