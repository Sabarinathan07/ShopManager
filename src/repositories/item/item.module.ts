import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/entity/item.entity';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { ItemValidator } from 'src/helpers/item.validator';

@Module({
    imports: [
        TypeOrmModule.forFeature([Item]),
        ConfigModule,
        UserModule,
    ],
    providers: [ItemService, ItemValidator],
    controllers: [ItemController],
    exports: [ItemService],
})
export class ItemModule {}
