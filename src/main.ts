import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    dotenv.config();
    const port = process.env.PORT || 3000;
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    console.log('Nest application created and Database connected');
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
bootstrap();
