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
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
// import { APP_INTERCEPTOR } from '@nestjs/core';
import { RedisOptions } from './database/resdis-options';

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
    providers: [
        AppService,
        // {
        //     provide: APP_INTERCEPTOR,
        //     useClass: CacheInterceptor,
        // },
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude('api/login', '/api/register', '/', '/api')
            .forRoutes('*');
    }
}
