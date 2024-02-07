import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class UserInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        // Logic to be executed before the request is handled by the controller
        console.log('Before request');

        const request = context.switchToHttp().getRequest();
        // Access the user information from the request object and perform any necessary operations

        return next.handle().pipe(
            // Logic to be executed after the request is handled by the controller
            tap(() => console.log('After request')),
        );
    }
}
