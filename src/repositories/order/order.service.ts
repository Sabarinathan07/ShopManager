import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createOrderDto } from 'src/dtos/createOrder.dto';
import { Item } from 'src/entity/item.entity';
import { Order } from 'src/entity/order.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private repo: Repository<Order>,
        @InjectRepository(Item) private itemRepo: Repository<Item>,
    ) {}

    async createOrder(body: createOrderDto, user: User) {
        const id = body.item;
        const itemDetails = await this.itemRepo.findOneBy({ id });
        if (!itemDetails)
            throw new NotFoundException('Item not found');

        // comment the next two lines if any errors ariswe
        itemDetails.quantity = itemDetails.quantity - body.quantity;
        await this.itemRepo.save(itemDetails);

        const newOrder = new Order();
        newOrder.customer = user as User;
        newOrder.quantity = body.quantity;
        newOrder.item = itemDetails as Item;
        newOrder.amount = itemDetails.price * body.quantity;

        const order = await this.repo.create(newOrder);
        return this.repo.save(order);
    }
    async updateOrder(body: any, id: string) {
        const orderToUpdate = await this.repo.findOneBy({ id });
        if (!orderToUpdate)
            throw new NotFoundException('No such order');

        orderToUpdate.quantity =
            body.quantity !== undefined
                ? body.quantity
                : orderToUpdate.quantity;
        orderToUpdate.transactionDate =
            body.transactionDate || orderToUpdate.transactionDate;
        orderToUpdate.customer =
            body.customer || orderToUpdate.customer;
        orderToUpdate.item = body.item || orderToUpdate.item;
        // orderToUpdate.amount =

        return this.repo.save(orderToUpdate);
    }
    getAllOrders() {
        return this.repo.find();
    }
    getAmountByDay(body: any) {
        throw new Error('Method not implemented.');
    }
    getAmountByWeek(body: any) {
        throw new Error('Method not implemented.');
    }
    getAmountByMonth(body: any) {
        throw new Error('Method not implemented.');
    }
}
