import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(json({ limit: '10mb' }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: parseCorsOrigins(process.env.CORS_ORIGINS),
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}

function parseCorsOrigins(commaSeparatedOrigins: string | undefined): string[] {
  if (!commaSeparatedOrigins) return DEFAULT_CORS_ORIGINS;
  return commaSeparatedOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const DEFAULT_CORS_ORIGINS = ['http://localhost:3000', 'http://localhost:3002'];

void bootstrap();
