import { TimelineInterface } from '../interfaces/timeline.interface';
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
import { OrderService } from '../services/order.service';
import { Timeline } from '../../../microservices/order/enums/Timeline';
import { OrderInterceptor } from '../../../microservices/order/interceptors/order.interceptor';
import { OrderInterface } from '../../../microservices/order/interfaces/order.interface';
import { customRequest } from '../../../microservices/user';

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
