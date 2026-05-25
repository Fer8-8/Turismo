 
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  // habilitar validación global para inputs GraphQL (class-validator)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // nota: endpoint GraphQL HTTP configurado en AppModule, disponible en /graphql
  app.use(express.static(join(process.cwd(), 'frontend')));

  const allowedOrigins = [
    /^http:\/\/localhost(:\d+)?$/,
    /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/,
    /^exp:\/\/192\.168\.\d+\.\d+(:\d+)?$/,
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some((regex) => regex.test(origin))) {
        callback(null, true);
      } else {
        callback(new Error(`CORS origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['set-cookie', 'Set-Cookie'],
  });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();