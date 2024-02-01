import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { createOrderDto } from 'src/dtos/createOrder.dto';

@Controller('api/order')
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Post()
    async createOrder(@Body() body: createOrderDto, @Req() req) {
        return await this.orderService.createOrder(
            body,
            req.currentUser,
        );
    }

    @Put('/:id')
    async updateOrder(@Body() body, @Param('id') id: string) {
        return await this.orderService.updateOrder(body, id);
    }

    @Get()
    async getAllOrders() {
        return await this.orderService.getAllOrders();
    }

    @Get('/day')
    async getAmountByDay(@Body() body) {
        return await this.orderService.getAmountByDay(body);
    }

    @Get('/week')
    async getAmountByWeek(@Body() body) {
        return await this.orderService.getAmountByWeek(body);
    }

    @Get('/month')
    async getAmountByMonth(@Body() body) {
        return await this.orderService.getAmountByMonth(body);
    }
}
