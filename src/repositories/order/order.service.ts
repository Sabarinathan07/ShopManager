import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createOrderDto } from 'src/dtos/createOrder.dto';
import { Item } from 'src/entity/item.entity';
import { Order } from 'src/entity/order.entity';
import { User } from 'src/entity/user.entity';
import { Between, Repository } from 'typeorm';

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

        if (body.quantity > itemDetails.quantity)
            throw new BadRequestException(
                'Requested quantity exceeds available stock try with a small amount',
            );

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

    async getAllOrders() {
        return await this.repo.find();
    }

    async getAmountByDay(body: any) {
        const startOfDay = new Date(body.date);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(body.date);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const orders = await this.repo.find({
            where: {
                transactionDate: Between(startOfDay, endOfDay),
            },
        });
        const totalAmount = orders.reduce(
            (acc, order) => acc + order.amount,
            0,
        );
        return { totalAmount };
    }

    async getAmountByWeek(body: any) {
        const startOfWeek = new Date(
            Date.UTC(body.year, 0, (body.week - 1) * 7 + 1),
        );
        const endOfWeek = new Date(
            Date.UTC(body.year, 0, body.week * 7, 23, 59, 59, 999),
        );
        const orders = await this.repo.find({
            where: {
                transactionDate: Between(startOfWeek, endOfWeek),
            },
        });
        const totalAmount = orders.reduce(
            (acc, order) => acc + order.amount,
            0,
        );
        return { totalAmount };
    }

    async getAmountByMonth(body: any) {
        const startOfMonth = new Date(
            Date.UTC(body.year, body.month - 1, 0),
        );
        const endOfMonth = new Date(
            Date.UTC(body.year, body.month, 0, 23, 59, 59, 999),
        );

        const orders = await this.repo.find({
            where: {
                transactionDate: Between(startOfMonth, endOfMonth),
            },
        });
        const totalAmount = orders.reduce(
            (acc, order) => acc + order.amount,
            0,
        );
        return { totalAmount };
    }
}
