import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './services/order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Order } from 'src/microservices/order/entity/order.entity';
import { Item } from 'src/microservices/item/entity/item.entity';
import { ItemService } from '../item/services/item.service';
import { OrderValidator } from 'src/microservices/order/helpers/order.validator';

@Module({
    imports: [TypeOrmModule.forFeature([Order, Item]), ConfigModule],
    controllers: [OrderController],
    providers: [OrderService, ItemService, OrderValidator],
})
export class OrderModule {}
