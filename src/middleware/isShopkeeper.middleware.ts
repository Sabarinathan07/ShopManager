import {
    ForbiddenException,
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { UserService } from 'src/repositories/user/user.service';

import { customRequest } from 'src/interfaces/request.interface';
import { Role } from 'src/enums/Role';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface customRequest extends Request {
            currentUser?: any;
        }
    }
}

@Injectable()
export class isShopkeeperMiddleware implements NestMiddleware {
    constructor(private userService: UserService) {}

    async use(req: customRequest, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            throw new UnauthorizedException(
                'No authorization header found',
            );
        }

        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }
        const JWT_SECRET = process.env.JWT_SECRET;
        const decoded = verify(token, JWT_SECRET);
        // console.log(decoded);
        req.currentUser = await this.userService.findById(decoded.id);
        // console.log(req.currentUser.user);

        if (req.currentUser.role != Role.shopkeeper) {
            throw new ForbiddenException(
                'Access denied! Shopkeeper Only!',
            );
        }

        next();
    }
}
