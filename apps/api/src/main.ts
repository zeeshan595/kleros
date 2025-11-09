import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // setup open api spec with scalar ui
  const openApiSpecConfig = new DocumentBuilder()
    .setTitle('Kleros Api')
    .setDescription('This api is used for better integration with kleros RPS')
    .setVersion('1.0')
    .addSecurity('bearer', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'bearer token',
    })
    .build();
  const openApiSpec = SwaggerModule.createDocument(app, openApiSpecConfig);
  app.use(
    '/doc',
    apiReference({
      content: openApiSpec,
      defaultHttpClient: {
        targetKey: 'js',
        clientKey: 'fetch',
      },
      pageTitle: 'Kleros Api',
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
