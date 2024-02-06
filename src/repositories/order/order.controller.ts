import { TimelineInterface } from '../../interfaces/timeline.interface';
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Timeline } from 'src/enums/Timeline';
import { OrderInterceptor } from 'src/Interceptor/order.interceptor';
import { OrderInterface } from 'src/interfaces/order.interface';

@Controller('api/order')
@UseInterceptors(OrderInterceptor)
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Post()
    async createOrder(@Body() body: OrderInterface, @Req() req) {
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

    @Post('/:timeline')
    async getAmount(
        @Body() body: TimelineInterface,
        @Param('timeline') timeline: Timeline,
    ) {
        if (timeline == Timeline.day) {
            return await this.orderService.getAmountByDay(body);
        } else if (timeline == Timeline.week) {
            return await this.orderService.getAmountByWeek(body);
        } else if (timeline == Timeline.month) {
            return await this.orderService.getAmountByMonth(body);
        } else {
            throw new BadRequestException('Invalid timeline');
        }
    }
}
