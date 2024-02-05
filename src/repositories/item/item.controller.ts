import { CreateItemDto } from 'src/dtos/item.dto';
import { ItemService } from './item.service';
import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Req,
} from '@nestjs/common';
import { customRequest } from 'src/interfaces/request.interface';
import { UpdateItemDto } from 'src/dtos/item.dto';

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

    @Get()
    async getAllItems() {
        return await this.itemService.getAllItems();
    }

    @Get('/:id')
    async getItemById(@Param('id') id: string) {
        return await this.itemService.getItemById(id);
    }

    @Put('/:id')
    async updateItem(
        @Param('id') id: string,
        @Body() body: UpdateItemDto,
    ) {
        return await this.itemService.updateItem(id, body);
    }

    @Put('/delete/:id')
    async deleteItemQuantity(@Param('id') id: string) {
        return await this.itemService.deleteItemQuantity(id);
    }
}
