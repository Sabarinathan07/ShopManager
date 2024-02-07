import {
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
    Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { OrderValidator } from 'src/helpers/order.validator';

@Injectable()
export class OrderInterceptor implements NestInterceptor {
    constructor(private orderValidator: OrderValidator) {}
    intercept(
        context: ExecutionContext,
        _handler: CallHandler,
    ): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const handler = context.getHandler().name;
        // const orderValidator = new OrderValidator();
        let errors: string[] = [];

        if (handler === 'createOrder') {
            errors = this.orderValidator.validateCreateOrder(req);
        }

        if (handler === 'updateOrder') {
            errors = this.orderValidator.validateUpdateOrder(req);
        }

        if (handler === 'getAmount') {
            errors =
                this.orderValidator.validateGetAmountRequest(req);
        }

        if (errors.length > 0) {
            throw new BadRequestException(errors);
        }

        return _handler.handle();
    }
}
