import { DbModule } from './database/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from './database/redis-options';
import { MicroservicesModule } from './microservices/microservices.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env`,
        }),
        CacheModule.registerAsync(RedisOptions),
        DbModule,
        MicroservicesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
