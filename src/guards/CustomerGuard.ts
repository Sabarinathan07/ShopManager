import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    UnauthorizedException,
} from '@nestjs/common';
import { Role } from 'src/microservices/user/enums/Role';

export class CustomerGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        if (!request.currentUser) {
            throw new UnauthorizedException('You are not logged in');
        }

        if (request.currentUser.role == Role.customer) {
            return true;
        }
        throw new ForbiddenException('Only customer can Access!');
    }
}
