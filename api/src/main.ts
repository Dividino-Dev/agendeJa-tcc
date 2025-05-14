import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  const publicPath = join(process.cwd(), 'public');
  console.log('📁 Servindo arquivos estáticos de:', publicPath);

  app.useStaticAssets(publicPath, {
    prefix: '/static/',
  });

  const config = new DocumentBuilder()
    .setTitle('AgendeJa API')
    .setDescription('API de agendamentos AgendeJa')
    .setVersion('1.0')
    .addTag('agendeJa')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
