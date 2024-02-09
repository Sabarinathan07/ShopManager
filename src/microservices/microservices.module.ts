import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ItemModule } from './item/item.module';
import { OrderModule } from './order/order.module';
import { AuthMiddleware } from 'src/middleware/auth.middleware';

@Module({
    imports: [UserModule, AuthModule, ItemModule, OrderModule],
})
export class MicroservicesModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude('api/login', '/api/register', '/', '/api')
            .forRoutes('*');
    }
}
