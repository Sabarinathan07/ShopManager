import { ItemService } from './item.service';
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
import { customRequest } from 'src/interfaces/request.interface';
import { ItemInterface } from 'src/interfaces/item.interface';
import { ItemInterceptor } from 'src/Interceptor/item.interceptor';
import { ShopkeeperGuard } from 'src/guards/ShopkeeperGuard';
// import {
//     CacheInterceptor,
//     CacheKey,
//     CacheTTL,
// } from '@nestjs/cache-manager';


@Controller('/api/item')
// @CacheKey('custom_key')
// @UseInterceptors(ItemInterceptor, CacheInterceptor)
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
