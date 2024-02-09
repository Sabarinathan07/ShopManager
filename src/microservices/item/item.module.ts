import { Module } from '@nestjs/common';
import { ItemService } from './services/item.service';
import { ItemController } from './item-api/controllers/item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/microservices/item/entity/item.entity';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { ItemValidator } from 'src/microservices/item/helpers/item.validator';
import { ItemApiModule } from './item-api/item-api.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Item]),
        ConfigModule,
        UserModule,
        ItemApiModule,
    ],
    providers: [ItemService, ItemValidator],
    controllers: [ItemController],
    exports: [ItemService],
})
export class ItemModule {}
