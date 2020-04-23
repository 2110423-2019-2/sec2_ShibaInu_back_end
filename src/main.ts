import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
require('dotenv').config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });

    const options = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('Youngstar API docs')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-list', app, document);

    await app.listen(10000);
}
bootstrap();
