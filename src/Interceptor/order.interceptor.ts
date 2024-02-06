import {
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { OrderValidator } from 'src/helpers/order.validator';

export class OrderInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        _handler: CallHandler,
    ): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const handler = context.getHandler().name;
        const orderValidator = new OrderValidator();
        let errors: string[];

        if (handler === 'createOrder') {
            errors = orderValidator.validateCreateOrder(req);
        }

        if (handler === 'updateOrder') {
            errors = orderValidator.validateUpdateOrder(req);
        }

        if (handler === 'getAmount') {
            errors = orderValidator.validateGetAmountRequest(req);
        }

        if (errors.length > 0) {
            throw new BadRequestException(errors);
        }

        return _handler.handle();
    }
}
