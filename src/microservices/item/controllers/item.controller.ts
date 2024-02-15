import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Req,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ItemService } from '../services/';
import { customRequest } from '../../../microservices/user/interfaces/';
import { ItemInterface } from '../../../microservices/item/interfaces/';
import { ItemInterceptor } from '../../../microservices/item/interceptors/';
import { ShopkeeperGuard } from '../../../guards/';

@Controller('/api/item')
@UseInterceptors(ItemInterceptor)
export class ItemController {
    constructor(private itemService: ItemService) {}

    @Post()
    @UseGuards(ShopkeeperGuard)
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
    @UseGuards(ShopkeeperGuard)
    async updateItem(
        @Param('id') id: string,
        @Body() body: ItemInterface,
    ) {
        return await this.itemService.updateItem(id, body);
    }

    @Put('/delete/:id')
    @UseGuards(ShopkeeperGuard)
    async deleteItemQuantity(@Param('id') id: string) {
        return await this.itemService.deleteItemQuantity(id);
    }
}
