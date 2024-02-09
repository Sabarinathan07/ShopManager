import { Module } from '@nestjs/common';
import { ItemService } from './services/item.service';
import { ItemController } from './controllers/item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/microservices/item/entity/item.entity';
import { UserModule } from '../user/user.module';
import { ItemValidator } from 'src/microservices/item/helpers/item.validator';

@Module({
    imports: [TypeOrmModule.forFeature([Item]), UserModule],
    providers: [ItemService, ItemValidator],
    controllers: [ItemController],
    exports: [ItemService],
})
export class ItemModule {}
