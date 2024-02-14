import { Module } from '@nestjs/common';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../microservices/order/entity/order.entity';
import { Item } from '../../microservices/item/entity/item.entity';
import { ItemService } from '../item/services/item.service';
import { OrderValidator } from '../../microservices/order/helpers/order.validator';

@Module({
    imports: [TypeOrmModule.forFeature([Order, Item])],
    controllers: [OrderController],
    providers: [OrderService, ItemService, OrderValidator],
})
export class OrderModule {}
