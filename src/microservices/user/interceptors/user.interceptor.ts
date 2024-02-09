import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserValidator } from '../helpers/user.validator';

@Injectable()
export class UserInterceptor implements NestInterceptor {
    constructor(private userValidator: UserValidator) {}
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const handler = context.getHandler().name;
        let errors: string[] = [];

        if (handler === 'deleteUserById') {
            errors = this.userValidator.validateDeleteUser(req);
        }

        if (errors.length > 0) {
            throw new BadRequestException(errors);
        }
        return next.handle();
    }
}
