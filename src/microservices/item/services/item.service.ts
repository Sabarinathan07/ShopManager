import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Item } from '../../../microservices/item/entity/item.entity';
import { ItemInterface } from '../../../microservices/item/interfaces/item.interface';
import { customRequest } from '../../../microservices/user/interfaces/request.interface';
import { Repository } from 'typeorm';
import { UserInterface } from '../../../microservices/user/interfaces/user.interface';
import { User } from '../../../microservices/user/entity/user.entity';

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item) private repo: Repository<Item>,
    ) {}
    async createItem(req: customRequest, body: ItemInterface) {
        const newItem = new Item();
        newItem.name = body.name;
        newItem.shopkeeper = req.currentUser;
        newItem.quantity = body.quantity;
        newItem.price = body.price;
        newItem.orders = [];
        // newItem.orders.push(new Order());

        await this.repo
            .createQueryBuilder()
            .insert()
            .into(Item)
            .values(newItem)
            .execute();

        return this.dbObjectToItem(newItem);
    }
    async getAllItems() {
        const items = await this.repo
            .createQueryBuilder('item')
            .leftJoinAndSelect('item.shopkeeper', 'user.id')
            .getMany();
        const mappedItems = items.map((item) =>
            this.dbObjectToItem(item),
        );
        return mappedItems;
    }

    async getItemById(id: string) {
        try {
            const found = await this.repo
                .createQueryBuilder('item')
                .leftJoinAndSelect('item.shopkeeper', 'user.id')
                .where('item.id = :id', { id })
                .getOne();
            return this.dbObjectToItem(found);
        } catch (error) {
            throw new NotFoundException('Could not find item');
        }
    }

    async updateItem(id: string, body: ItemInterface) {
        const itemToUpdate = await this.repo
            .createQueryBuilder('item')
            .leftJoinAndSelect('item.shopkeeper', 'user.id')
            .where('item.id = :id', { id })
            .getOne();
        if (!itemToUpdate)
            throw new NotFoundException('Item not found');

        const newItem = new Item();
        newItem.id = id;
        newItem.name = body.name || itemToUpdate.name;
        newItem.price = body.price || itemToUpdate.price;
        newItem.quantity = body.quantity || itemToUpdate.quantity;
        newItem.orders = itemToUpdate.orders;
        newItem.shopkeeper = itemToUpdate.shopkeeper;

        await this.repo
            .createQueryBuilder()
            .update(Item)
            .set(itemToUpdate)
            .where('id= :id', { id })
            .execute();

        return this.dbObjectToItem(newItem);
    }

    async deleteItemQuantity(id: string) {
        const itemToUpdate = await this.repo
            .createQueryBuilder('item')
            .leftJoinAndSelect('item.shopkeeper', 'user.id')
            .where('item.id = :id', { id })
            .getOne();
        if (!itemToUpdate)
            throw new NotFoundException('Item not found');

        itemToUpdate.quantity = 0;
        await this.repo
            .createQueryBuilder()
            .update(Item)
            .set(itemToUpdate)
            .where('id= :id', { id })
            .execute();

        return this.dbObjectToItem(itemToUpdate);
    }

    private dbObjectToItem(item: Item): ItemInterface {
        const { id, name, quantity, price } = item;
        const user = item.shopkeeper;
        const shopkeeper = this.dbObjectToShopkeeper(user);
        return <ItemInterface>{
            id,
            name,
            price,
            quantity,
            shopkeeper,
        };
    }

    private dbObjectToShopkeeper(user: User): UserInterface {
        const { id, name, email } = user;
        return { id, name, email };
    }
}
