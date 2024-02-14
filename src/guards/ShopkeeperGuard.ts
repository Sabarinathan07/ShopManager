import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    UnauthorizedException,
} from '@nestjs/common';
import { Role } from '../microservices/user/enums/Role';

export class ShopkeeperGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        if (!request.currentUser) {
            throw new UnauthorizedException('You are not logged in');
        }

        if (request.currentUser.role == Role.shopkeeper) {
            return true;
        }
        throw new ForbiddenException('Only Shopkeeper can Access!');
    }
}
