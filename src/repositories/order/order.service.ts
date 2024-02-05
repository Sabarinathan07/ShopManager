import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateOrderDto, createOrderDto } from 'src/dtos/order.dto';
import { Item } from 'src/entity/item.entity';
import { Order } from 'src/entity/order.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { ItemService } from '../item/item.service';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private repo: Repository<Order>,
        @InjectRepository(Item) private itemRepo: Repository<Item>,
        private itemService: ItemService,
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

        // const order = await this.repo.create(newOrder);
        const order = await this.repo
            .createQueryBuilder()
            .insert()
            .into(Order)
            .values(newOrder)
            .execute();

        console.log(order);
        return order;
    }

    async updateOrder(body: UpdateOrderDto, id: string) {
        // const orderToUpdate = await this.repo.findOneBy({ id });
        const orderToUpdate = await this.repo
            .createQueryBuilder('order')
            .where('order.id = :id', { id })
            .getOne();
        if (!orderToUpdate)
            throw new NotFoundException('No such order');

        orderToUpdate.quantity =
            body.quantity !== undefined
                ? body.quantity
                : orderToUpdate.quantity;
        if (body.item) {
            const item = await this.itemService.getItemById(
                body.item,
            );
            if (!item)
                throw new BadRequestException(
                    "The given item doesn't exist",
                );

            orderToUpdate.item = item as Item;
        }

        return await this.repo
            .createQueryBuilder()
            .update(Order)
            .set(orderToUpdate)
            .where('id = :id', { id })
            .execute();
        // return this.repo.save(orderToUpdate);
    }

    async getAllOrders() {
        // return await this.repo.find();

        return await this.repo.createQueryBuilder('order').getMany();
    }

    async getAmountByDay(body: any) {
        const currentDate = body.date;

        if (
            currentDate &&
            !(currentDate instanceof Date) &&
            isNaN(Date.parse(currentDate))
        ) {
            throw new BadRequestException('Invalid date format');
        }
        const startOfDay = new Date(body.date);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(body.date);
        endOfDay.setUTCHours(23, 59, 59, 999);

        // const orders = await this.repo.find({
        //     where: {
        //         transactionDate: Between(startOfDay, endOfDay),
        //     },
        // });

        const orders = await this.repo
            .createQueryBuilder('order')
            .where(
                'order.transactionDate BETWEEN :startOfDay AND :endOfDay',
                {
                    startOfDay,
                    endOfDay,
                },
            )
            .getMany();
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
        // const orders = await this.repo.find({
        //     where: {
        //         transactionDate: Between(startOfWeek, endOfWeek),
        //     },
        // });

        const orders = await this.repo
            .createQueryBuilder('order')
            .where(
                'order.transactionDate BETWEEN :startOfWeek AND :endOfWeek',
                {
                    startOfWeek,
                    endOfWeek,
                },
            )
            .getMany();
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

        // const orders = await this.repo.find({
        //     where: {
        //         transactionDate: Between(startOfMonth, endOfMonth),
        //     },
        // });

        const orders = await this.repo
            .createQueryBuilder('order')
            .where(
                'order.transactionDate BETWEEN :startOfMonth AND :endOfMonth',
                {
                    startOfMonth,
                    endOfMonth,
                },
            )
            .getMany();
        const totalAmount = orders.reduce(
            (acc, order) => acc + order.amount,
            0,
        );
        return { totalAmount };
    }
}
