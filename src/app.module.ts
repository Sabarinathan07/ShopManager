import { DbModule } from './database/';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './';
import { AppService } from './';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from './database/';
import { MicroservicesModule } from './microservices/';

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
