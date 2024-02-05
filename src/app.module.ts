import { DbModule } from './database/config';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from './repositories/item/item.module';
import { UserModule } from './repositories/user/user.module';
import { OrderModule } from './repositories/order/order.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { AuthModule } from './repositories/auth/auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env`,
        }),
        DbModule, // Use the DatabaseModule here
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
        // consumer
        //     .apply(AuthMiddleware)
        //     .exclude('api/login', '/api/register')
        //     .forRoutes('*');
        consumer
            .apply(AuthMiddleware)
            .exclude('api/login', '/api/register', '/', '/api')
            .forRoutes('*');
    }
}
