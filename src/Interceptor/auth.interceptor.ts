import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthValidator } from 'src/helpers/auth.validator';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
    constructor(private authValidator: AuthValidator) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const handler = context.getHandler().name;
        // const authValidator = new authValidator();
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
        return next.handle();
    }
}
