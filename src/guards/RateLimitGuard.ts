import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { error } from 'console';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({ duration: 300 });
export class RateLimitGuard implements CanActivate {
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const handler = context.getHandler().name;
        // console.log('Before if', rateLimiter);

        if (handler == 'loginUser') {
            rateLimiter['_keyPrefix'] = 'loginUser';
            rateLimiter['_points'] = 5;
            // console.log('Inside login', rateLimiter);
        }

        if (handler == 'createUser') {
            rateLimiter['_keyPrefix'] = 'createUser';
            rateLimiter['_points'] = 3;
            // console.log('Inside register', rateLimiter);
        }

        // console.log('After if', rateLimiter);

        try {
            const rateLimiterRes = await rateLimiter.consume(
                request.ip + request.body.email,
            );
            console.log(rateLimiterRes);
        } catch (rateLimiterRes) {
            const minLeft = Math.ceil(
                rateLimiterRes.msBeforeNext / 1000 / 60,
            );
            console.log(rateLimiterRes.msBeforeNext);

            throw new HttpException(
                {
                    error: `Too many requests try again after ${minLeft} Minutes`,
                },
                HttpStatus.TOO_MANY_REQUESTS,
                {
                    cause: error,
                },
            );
        }

        return true;
    }
}

// import {
//     CanActivate,
//     ExecutionContext,
//     HttpException,
//     HttpStatus,
// } from '@nestjs/common';
// import { error } from 'console';
// import { RateLimiterMemory } from 'rate-limiter-flexible';

// const rateLimiter = new RateLimiterMemory({
//     points: 15,
//     duration: 300,
// });
// export class RateLimitGuard implements CanActivate {
//     async canActivate(context: ExecutionContext) {
//         const request = context.switchToHttp().getRequest();
//         const handler = context.getHandler().name;
//         let points = 0;
//         // console.log(rateLimiter);

//         if (handler == 'loginUser') {
//             points = 3;
//         }

//         if (handler == 'createUser') {
//             points = 5;
//         }

//         // console.log(rateLimiter);

//         try {
//             const rateLimiterRes = await rateLimiter.consume(
//                 request.ip + request.body.email,
//                 points,
//             );
//             console.log(rateLimiterRes);
//         } catch (rateLimiterRes) {
//             const minLeft = Math.ceil(
//                 rateLimiterRes.msBeforeNext / 1000 / 60,
//             );
//             console.log(rateLimiterRes.msBeforeNext);

//             throw new HttpException(
//                 {
//                     error: `Too many requests try again after ${minLeft} Minutes`,
//                 },
//                 HttpStatus.TOO_MANY_REQUESTS,
//                 {
//                     cause: error,
//                 },
//             );
//         }

//         return true;
//     }
// }
