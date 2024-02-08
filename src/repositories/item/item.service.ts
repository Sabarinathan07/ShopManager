import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Item } from 'src/entity/item.entity';
import { ItemInterface } from 'src/interfaces/item.interface';
import { customRequest } from 'src/interfaces/request.interface';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { UserInterface } from 'src/interfaces/user.interface';
import { User } from 'src/entity/user.entity';

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

        await this.repo
            .createQueryBuilder()
            .insert()
            .into(Item)
            .values(newItem)
            .execute();

        return this.dbObjectToItem(newItem);

        // const item = this.repo.create(newItem);
        // return await this.repo.save(item);
    }
    async getAllItems() {
        // return await this.repo.find();

        const items = await this.repo
            .createQueryBuilder('item')
            .leftJoinAndSelect('item.shopkeeper', 'user.id')
            .getMany();
        return this.mapItemsResponse(items);
    }

    async getItemById(id: string) {
        try {
            // const found = await this.repo.findOneBy({ id });
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
        // const itemToUpdate = await this.repo.findOneBy({ id });
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
        // return await this.repo.save(newItem);
    }

    async deleteItemQuantity(id: string) {
        // const itemToUpdate = await this.repo.findOneBy({ id });
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
        // return await this.repo.save(itemToUpdate);
    }

    private mapItemsResponse(items: Item[]) {
        const mappedItems = items.map((item) =>
            this.dbObjectToItem(item),
        );
        return mappedItems;
    }

    private dbObjectToItem(item: Item): ItemInterface {
        const { id, name, quantity, price } = item;
        const user = item.shopkeeper;
        const shopkeeper = this.dbObjectToCustomer(user);
        return <ItemInterface>{
            id,
            name,
            price,
            quantity,
            shopkeeper,
        };
    }

    private dbObjectToCustomer(user: User): UserInterface {
        const { id, name, email } = user;
        return { id, name, email };
    }
}
