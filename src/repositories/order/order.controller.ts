import { TimelineI } from '../../interfaces/timeline.interface';
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
import { createOrderDto } from 'src/dtos/order.dto';
import { Timeline } from 'src/enums/Timeline';
import { PartialTimeLineDto } from 'src/dtos/timeline.dto';
import { TimelineInterceptor } from 'src/Interceptor/timeline.interceptor';

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

    @UseInterceptors(TimelineInterceptor)
    @Post('/:timeline')
    async getAmount(
        @Body() body: PartialTimeLineDto,
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
