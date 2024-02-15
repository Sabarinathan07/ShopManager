import { Module } from '@nestjs/common';
import { OrderController } from './controllers/';
import { OrderService } from './services/';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../microservices/order/entity/';
import { Item } from '../../microservices/item/entity/';
import { ItemService } from '../item/services/';
import { OrderValidator } from '../../microservices/order/helpers/';

@Module({
    imports: [TypeOrmModule.forFeature([Order, Item])],
    controllers: [OrderController],
    providers: [OrderService, ItemService, OrderValidator],
})
export class OrderModule {}
