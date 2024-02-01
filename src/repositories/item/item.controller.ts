import { CreateItemDto } from 'src/dtos/createItem.dto';
import { ItemService } from './item.service';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { customRequest } from 'src/interfaces/request.interface';

@Controller('/api/item')
export class ItemController {
    constructor(private itemService: ItemService) {}

    @Post()
    async createItem(
        @Body() body: CreateItemDto,
        @Req() req: customRequest,
    ) {
        return await this.itemService.createItem(req, body);
    }
}
