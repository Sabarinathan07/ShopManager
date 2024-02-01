import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/entity/item.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [TypeOrmModule.forFeature([Item]), ConfigModule],
    providers: [ItemService],
    controllers: [ItemController],
    exports: [ItemService],
})
export class ItemModule {}
