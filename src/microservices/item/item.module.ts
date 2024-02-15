import { Module } from '@nestjs/common';
import { ItemService } from './services/';
import { ItemController } from './controllers/';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from '../../microservices/item/entity/';
import { ItemValidator } from '../../microservices/item/helpers/';

@Module({
    imports: [TypeOrmModule.forFeature([Item])],
    providers: [ItemService, ItemValidator],
    controllers: [ItemController],
    exports: [ItemService],
})
export class ItemModule {}
