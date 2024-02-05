import {
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Timeline } from 'src/enums/Timeline';

export class TimelineInterceptor implements NestInterceptor {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    intercept(
        context: ExecutionContext,
        _handler: CallHandler,
    ): Observable<any> {
        // throw new Error('Method not implemented.');
        const req = context.switchToHttp().getRequest();
        if (req.params.timeline == Timeline.day) {
            if (!req.body.date) {
                throw new BadRequestException('Day is required');
            }
        } else if (req.params.timeline == Timeline.week) {
            if (!req.body.week || !req.body.year) {
                console.log(req.body);
                throw new BadRequestException(
                    'Both week and year are required',
                );
            }
        } else if (req.params.timeline == Timeline.month) {
            if (!req.body.month || !req.body.year) {
                throw new BadRequestException(
                    'Both month and year 123are required',
                );
            }
        }
        return _handler.handle();
    }
}
