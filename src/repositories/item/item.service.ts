import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateItemDto } from 'src/dtos/createItem.dto';
import { Item } from 'src/entity/item.entity';
import { customRequest } from 'src/interfaces/request.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item) private repo: Repository<Item>,
    ) {}
    async createItem(req: customRequest, body: CreateItemDto) {
        const newItem = new Item();
        newItem.name = body.name;
        newItem.shopkeeper = req.currentUser.id;
        newItem.quantity = body.quantity;
        newItem.price = body.price;
        newItem.orders = [];
        const item = this.repo.create(newItem);
        return await this.repo.save(item);
    }
    async getAllItems() {
        return await this.repo.find();
    }

    async getItemById(id: string) {
        return await this.repo.findOneBy({ id });
    }

    async updateItem(id: string, body: Partial<CreateItemDto>) {
        const itemToUpdate = await this.repo.findOneBy({ id });
        if (!itemToUpdate)
            throw new NotFoundException('Item not found');

        const newItem = new Item();
        newItem.id = id;
        newItem.name = body.name || itemToUpdate.name;
        newItem.price = body.price || itemToUpdate.price;
        newItem.quantity = body.quantity || itemToUpdate.quantity;
        newItem.orders = itemToUpdate.orders;
        newItem.shopkeeper = itemToUpdate.shopkeeper;

        return await this.repo.save(newItem);
    }

    async deleteItemQuantity(id: string) {
        const itemToUpdate = await this.repo.findOneBy({ id });
        if (!itemToUpdate)
            throw new NotFoundException('Item not found');
        itemToUpdate.quantity = 0;
        return await this.repo.save(itemToUpdate);
    }
}
