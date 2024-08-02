import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { SERVER_PORT } from './constants';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Lidapay API')
    .setDescription('A secured RESTFUL API to serve LidaPay Mobile and Web applications.')
    .setVersion('1.0')
    .addTag('lidapay')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || SERVER_PORT;
  await app.listen(port);
  logger.debug(`Lidapay app is running on: ${await app.getUrl()}`);
}
bootstrap();
