import { Injectable } from '@nestjs/common';
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
    createItem(req: customRequest, body: CreateItemDto) {
        const newItem = new Item();
        newItem.name = body.name;
        newItem.shopkeeper = req.currentUser.id;
        newItem.quantity = body.quantity;
        newItem.price = body.price;
        newItem.orders = [];
        const item = this.repo.create(newItem);
        return this.repo.save(item);
    }
}
