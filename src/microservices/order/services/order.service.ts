import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../../../microservices/item/entity/item.entity';
import { Order } from '../../../microservices/order/entity/order.entity';
import { User } from '../../../microservices/user/entity/user.entity';
import { Repository } from 'typeorm';
import { ItemService } from '../../item/services/item.service';
import { OrderInterface } from '../../../microservices/order/interfaces/order.interface';
import { UserInterface } from '../../../microservices/user/interfaces/user.interface';
import { ItemInterface } from '../../../microservices/item/interfaces/item.interface';
import { customRequest } from '../../../microservices/user/interfaces/request.interface';

@Injectable()
export class OrderService {
    constructor(
        // @Inject(forwardRef(() => ItemService))
        @InjectRepository(Order)
        private repo: Repository<Order>,
        @InjectRepository(Item) private itemRepo: Repository<Item>,
        private itemService: ItemService,
    ) {}

    async createOrder(body: OrderInterface, user: User) {
        const itemDetails = await this.updateItemQuantity(
            body.item,
            body.quantity,
        );

        const newOrder = new Order();
        newOrder.customer = user as User;
        newOrder.quantity = body.quantity;
        newOrder.item = itemDetails as Item;
        newOrder.amount = itemDetails.price * body.quantity;

        await this.repo
            .createQueryBuilder()
            .insert()
            .into(Order)
            .values(newOrder)
            .execute();

        return this.dbObjectToOrder(newOrder);
    }

    async updateOrder(body: OrderInterface, id: string) {
        const orderToUpdate = await this.repo
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.item', 'item.id')
            .leftJoinAndSelect('order.customer', 'user.id')
            .where('order.id = :id', { id })
            .getOne();

        if (!orderToUpdate)
            throw new NotFoundException('No such order');

        if (body.item) {
            const item = await this.itemService.getItemById(
                body.item.toString(),
            );
            if (!item)
                throw new BadRequestException(
                    "The given item doesn't exist",
                );

            orderToUpdate.item = item as Item;
        }

        if (body.quantity) {
            const itemDetails = await this.updateItemQuantity(
                orderToUpdate.item.id,
                body.quantity,
            );
            orderToUpdate.quantity = body.quantity;
            orderToUpdate.item = itemDetails as Item;
            orderToUpdate.amount = itemDetails.price * body.quantity;
        }

        await this.repo
            .createQueryBuilder()
            .update(Order)
            .set(orderToUpdate)
            .where('id = :id', { id })
            .execute();

        return this.dbObjectToOrder(orderToUpdate);
    }

    async getAllOrders() {
        const order = await this.repo
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.item', 'item.id')
            .leftJoinAndSelect('order.customer', 'user.id')
            .getMany();
        return this.mapOrdersResponse(order);
    }

    async getAmountByDay(body: any, req: customRequest) {
        const startOfDay = new Date(body.date);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(body.date);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const orders = await this.repo
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.item', 'item.id')
            .leftJoinAndSelect('order.customer', 'user.id')
            .where('order.transactionDate >= :startOfDay', {
                startOfDay,
            })
            .andWhere('order.transactionDate <= :endOfDay', {
                endOfDay,
            })

            .andWhere('order.customer = :customerId', {
                customerId: req.currentUser.id,
            })
            .getMany();

        const totalAmount = orders.reduce(
            (acc, order) => acc + order.amount,
            0,
        );
        const order = this.mapOrdersResponse(orders);
        return { totalAmount, order };
    }

    async getAmountByWeek(body: any, req: customRequest) {
        const startOfWeek = new Date(
            Date.UTC(body.year, 0, (body.week - 1) * 7 + 1),
        );
        const endOfWeek = new Date(
            Date.UTC(body.year, 0, body.week * 7, 23, 59, 59, 999),
        );

        const orders = await this.repo
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.item', 'item.id')
            .leftJoinAndSelect('order.customer', 'user.id')
            .where('order.transactionDate >= :startOfWeek', {
                startOfWeek,
            })
            .andWhere('order.transactionDate <= :endOfWeek', {
                endOfWeek,
            })

            .andWhere('order.customer = :customerId', {
                customerId: req.currentUser.id,
            })
            .getMany();

        const totalAmount = orders.reduce(
            (acc, order) => acc + order.amount,
            0,
        );
        const order = this.mapOrdersResponse(orders);

        return { totalAmount, order };
    }

    async getAmountByMonth(body: any, req: customRequest) {
        const startOfMonth = new Date(
            Date.UTC(body.year, body.month - 1, 0),
        );
        const endOfMonth = new Date(
            Date.UTC(body.year, body.month, 0, 23, 59, 59, 999),
        );

        const orders = await this.repo
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.item', 'item.id')
            .leftJoinAndSelect('order.customer', 'user.id')
            .where('order.transactionDate >= :startOfMonth', {
                startOfMonth,
            })
            .andWhere('order.transactionDate <= :endOfMonth', {
                endOfMonth,
            })
            .andWhere('order.customer = :customerId', {
                customerId: req.currentUser.id,
            })
            .getMany();

        const totalAmount = orders.reduce(
            (acc, order) => acc + order.amount,
            0,
        );
        const order = this.mapOrdersResponse(orders);

        return { totalAmount, order };
    }

    private async updateItemQuantity(id, quantity) {
        const itemDetails = await this.itemRepo.findOneBy({
            id,
        });
        if (!itemDetails)
            throw new NotFoundException('Item not found');

        if (quantity > itemDetails.quantity)
            throw new BadRequestException(
                'Requested quantity exceeds available stock try with a small amount',
            );

        // itemDetails.orders = [...itemDetails.orders, id];

        itemDetails.quantity = itemDetails.quantity - quantity;
        await this.itemRepo
            .createQueryBuilder()
            .update(Item)
            .set(itemDetails)
            .where('id= :id', { id })
            .execute();
        return itemDetails;
    }

    private mapOrdersResponse(orders: Order[]) {
        const mappedItems = orders.map((order) =>
            this.dbObjectToOrder(order),
        );
        return mappedItems;
    }

    private dbObjectToOrder(order: Order): OrderInterface {
        const { id, quantity, amount } = order;
        const user = order.customer;
        const customer = this.dbObjectToCustomer(user);
        const itemObject = order.item;
        const item = this.dbObjectToItem(itemObject);
        return {
            id,
            quantity,
            item,
            customer,
            amount,
        };
    }

    private dbObjectToCustomer(user: User): UserInterface {
        const { id, name, email } = user;
        return <UserInterface>{ id, name, email };
    }

    private dbObjectToItem(item: Item): ItemInterface {
        const { id, name, price } = item;
        return <ItemInterface>{ id, name, price };
    }
}
