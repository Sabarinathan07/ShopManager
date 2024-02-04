import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/entity/item.entity';
import { ConfigModule } from '@nestjs/config';
import { isShopkeeperMiddleware } from 'src/middleware/isShopkeeper.middleware';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Item]),
        ConfigModule,
        UserModule,
    ],
    providers: [ItemService],
    controllers: [ItemController],
    exports: [ItemService],
})
export class ItemModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(isShopkeeperMiddleware)
            .exclude({ path: 'api/item', method: RequestMethod.GET })
            .forRoutes('api/item');
    }
}
