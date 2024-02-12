import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { error } from 'console';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
    points: 5, // Number of points
    duration: 300, // Per second
});

export class RateLimitGuard implements CanActivate {
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        await rateLimiter
            .consume(request.ip)
            .then((rateLimiterRes) => {
                console.log(rateLimiterRes);
            })
            .catch((rateLimiterRes) => {
                // Not enough points to consume
                const minLeft = Math.ceil(
                    rateLimiterRes.msBeforeNext / 1000 / 60,
                );

                throw new HttpException(
                    {
                        error: `Too many requests try again after ${minLeft} Minutes`,
                    },
                    HttpStatus.TOO_MANY_REQUESTS,
                    {
                        cause: error,
                    },
                );
            });

        return true;
    }
}
