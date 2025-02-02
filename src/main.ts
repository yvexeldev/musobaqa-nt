import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const logger = new Logger('Main');

    const app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService);
    const PORT = config.get('PORT', 3333);
    const options = new DocumentBuilder()
        .setTitle('Musobaqa API')
        .setDescription('The Musobaqa API description')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);

    await app.listen(PORT);
    logger.log(`Application running on ${PORT}-port`);
}
bootstrap();
