import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Order } from 'src/entity/order.entity';
import { Item } from 'src/entity/item.entity';
import { ItemService } from '../item/item.service';

@Module({
    imports: [TypeOrmModule.forFeature([Order, Item]), ConfigModule],
    controllers: [OrderController],
    providers: [OrderService, ItemService],
})
export class OrderModule {}
