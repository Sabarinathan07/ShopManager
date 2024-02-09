import { ItemService } from '../services/item.service';
import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { customRequest } from 'src/microservices/user/interfaces/request.interface';
import { ItemInterface } from 'src/microservices/item/interfaces/item.interface';
import { ItemInterceptor } from 'src/microservices/item/interceptors/item.interceptor';

@Controller('/api/item')
@UseInterceptors(ItemInterceptor)
export class ItemController {
    constructor(private itemService: ItemService) {}

    @Post()
    async createItem(
        @Body() body: ItemInterface,
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
        @Body() body: ItemInterface,
    ) {
        return await this.itemService.updateItem(id, body);
    }

    @Put('/delete/:id')
    async deleteItemQuantity(@Param('id') id: string) {
        return await this.itemService.deleteItemQuantity(id);
    }
}
