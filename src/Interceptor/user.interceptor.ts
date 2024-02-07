import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserValidator } from 'src/helpers/user.validator';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class UserInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const handler = context.getHandler().name;
        const userValidator = new UserValidator();
        let errors: string[] = [];

        if (handler === 'createUser') {
            errors = userValidator.validateCreateUser(req);
        }

        if (handler === 'loginUser') {
            errors = userValidator.validateLoginUser(req);
        }

        if (handler === 'logoutUser') {
            errors = [];
        }

        if (errors.length > 0) {
            throw new BadRequestException(errors);
        }
        return next.handle();
    }
}
