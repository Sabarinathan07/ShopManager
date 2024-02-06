import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Item } from 'src/entity/item.entity';
import { ItemInterface } from 'src/interfaces/item.interface';
import { customRequest } from 'src/interfaces/request.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item) private repo: Repository<Item>,
    ) {}
    async createItem(req: customRequest, body: ItemInterface) {
        const newItem = new Item();
        newItem.name = body.name;
        newItem.shopkeeper = req.currentUser.id;
        newItem.quantity = body.quantity;
        newItem.price = body.price;
        newItem.orders = [];

        const item = await this.repo
            .createQueryBuilder()
            .insert()
            .into(Item)
            .values(newItem)
            .execute();

        return item;

        // const item = this.repo.create(newItem);
        // return await this.repo.save(item);
    }
    async getAllItems() {
        // return await this.repo.find();
        return await this.repo.createQueryBuilder('item').getMany();
    }

    async getItemById(id: string) {
        try {
            // const found = await this.repo.findOneBy({ id });
            const found = await this.repo
                .createQueryBuilder('item')
                .where('item.id = :id', { id })
                .getOne();
            return found;
        } catch (error) {
            throw new NotFoundException('Could not find item');
        }
    }

    async updateItem(id: string, body: ItemInterface) {
        // const itemToUpdate = await this.repo.findOneBy({ id });
        const itemToUpdate = await this.repo
            .createQueryBuilder('item')
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

        return newItem;
        // return await this.repo.save(newItem);
    }

    async deleteItemQuantity(id: string) {
        // const itemToUpdate = await this.repo.findOneBy({ id });
        const itemToUpdate = await this.repo
            .createQueryBuilder('item')
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

        return itemToUpdate;
        // return await this.repo.save(itemToUpdate);
    }
}
