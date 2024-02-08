import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ItemValidator } from 'src/helpers/item.validator';

@Injectable()
export class ItemInterceptor implements NestInterceptor {
    constructor(private itemValidator: ItemValidator) {}
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const handler = context.getHandler().name;
        let errors: string[] = [];

        if (handler === 'createItem') {
            errors = this.itemValidator.validateCreateItem(req);
        }

        if (handler === 'updateItem') {
            errors = this.itemValidator.validateUpdateItem(req);
        }
        if (errors.length > 0) {
            throw new BadRequestException(errors);
        }

        return next
            .handle()
            .pipe
            // Logic to be executed after the request is handled by the controller
            // tap(() => console.log('After handling the request')),
            ();
    }
}
