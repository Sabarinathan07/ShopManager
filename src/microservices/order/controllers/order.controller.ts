import { TimelineInterface } from '../interfaces/';
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
import { OrderService } from '../services/';
import { Timeline } from '../../../microservices/order/enums/';
import { OrderInterceptor } from '../../../microservices/order/interceptors/';
import { OrderInterface } from '../../../microservices/order/interfaces/';
import { customRequest } from '../../../microservices/';

@Controller('api/order')
@UseInterceptors(OrderInterceptor)
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Post()
    async createOrder(
        @Body() body: OrderInterface,
        @Req() req: customRequest,
    ) {
        return await this.orderService.createOrder(
            body,
            req.currentUser,
        );
    }

    @Put('/:id')
    async updateOrder(
        @Body() body: OrderInterface,
        @Param('id') id: string,
    ) {
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
        @Req() req,
    ) {
        if (timeline == Timeline.day) {
            return await this.orderService.getAmountByDay(body, req);
        } else if (timeline == Timeline.week) {
            return await this.orderService.getAmountByWeek(body, req);
        } else if (timeline == Timeline.month) {
            return await this.orderService.getAmountByMonth(
                body,
                req,
            );
        } else {
            throw new BadRequestException('Invalid timeline');
        }
    }
}
