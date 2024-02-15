import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserModule } from './user/';
import { AuthModule } from './auth/';
import { ItemModule } from './item/';
import { OrderModule } from './order/';
import { AuthMiddleware } from '../middleware/';
import { TeamModule } from './team';
@Module({
    imports: [
        UserModule,
        AuthModule,
        ItemModule,
        OrderModule,
        TeamModule,
    ],
})
export class MicroservicesModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude('api/login', '/api/register', '/', '/api')
            .forRoutes('*');
    }
}
