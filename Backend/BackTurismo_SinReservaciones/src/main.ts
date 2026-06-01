import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload-ts';

let app: INestApplication;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: [
      'https://turismo-ochre.vercel.app',
      'http://localhost:3000',
      'https://turismo-lemon.vercel.app',
      'http://192.168.1.144:5173',
      'http://localhost:5173',
      'https://dashboard-tanstack.vercel.app',
      'http://localhost:5174',
      'https://dashboard-sigma-ten-16.vercel.app',
      'https://foliatti.seanalytics.solutions',
    ],
      credentials: true,
    });
    // bodyParser: false solo es necesario cuando better-auth está activo
    // await app.init(); // Necesario si se va a exportar el adapter
  }
  return app;
}

if (require.main === module || process.env.STANDALONE === 'true') {
  bootstrap().then(async (appInstance) => {
    const port = process.env.PORT ?? 3000;
    await appInstance.listen(port);
    console.log(`Application is running on port: ${port}`);
  });
}

export default async (req: any, res: any) => {
  const appInstance = await bootstrap();
  await appInstance.init();
  const instance = appInstance.getHttpAdapter().getInstance();
  return instance(req, res);
};
