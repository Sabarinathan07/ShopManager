import { DbModule } from './database/config';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from './repositories/item/item.module';
import { UserModule } from './repositories/user/user.module';
import { OrderModule } from './repositories/order/order.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { AuthModule } from './repositories/auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from './database/redis-options';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env`,
        }),
        CacheModule.registerAsync(RedisOptions),
        DbModule,
        AuthModule,
        UserModule,
        ItemModule,
        OrderModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude('api/login', '/api/register', '/', '/api')
            .forRoutes('*');
    }
}
