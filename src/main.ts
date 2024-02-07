import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    dotenv.config();
    const port = process.env.PORT || 3000;
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    console.log('Nest application created and Database connected');
    // app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
        .setTitle('Cheta Shop Money Manager')
        .setDescription("We have API's for User, Item & Order!")
        .setVersion('1.0')
        .addTag('ChetaShop Money Manager')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
bootstrap();
