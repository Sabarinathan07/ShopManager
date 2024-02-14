import { Module } from '@nestjs/common';
import { ItemService } from './services/item.service';
import { ItemController } from './controllers/item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from '../../microservices/item/entity/item.entity';
import { ItemValidator } from '../../microservices/item/helpers/item.validator';

@Module({
    imports: [TypeOrmModule.forFeature([Item])],
    providers: [ItemService, ItemValidator],
    controllers: [ItemController],
    exports: [ItemService],
})
export class ItemModule {}
