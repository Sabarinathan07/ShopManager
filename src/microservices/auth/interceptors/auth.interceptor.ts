import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthValidator } from '../../../microservices/auth/helpers/';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
    constructor(private authValidator: AuthValidator) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const handler = context.getHandler().name;
        let errors: string[] = [];

        if (handler === 'createUser') {
            errors = this.authValidator.validateCreateUser(req);
        }

        if (handler === 'loginUser') {
            errors = this.authValidator.validateLoginUser(req);
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
