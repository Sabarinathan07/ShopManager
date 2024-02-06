// import { customRequest } from '../interfaces/request.interface';
import {
    Injectable,
    NestMiddleware,
    Req,
    UnauthorizedException,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { UserService } from 'src/repositories/user/user.service';
import { verify } from 'jsonwebtoken';
import { User } from 'src/entity/user.entity';
import { customRequest } from 'src/interfaces/request.interface';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        // interface Request {
        //     currentUser?: User;
        // }
    }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private userService: UserService) {}

    async use(req: customRequest, res: Response, next: NextFunction) {
        try {
            // if (!req.headers.authorization) {
            //     throw new Error('No authorization header found');
            // }
            // console.log(req.cookies);
            // const { token } = req.body || {};

            const token = req.cookies['token'];

            if (!token) {
                throw new UnauthorizedException('Token not provided');
            }

            const JWT_SECRET = process.env.JWT_SECRET;
            const decoded = verify(token, JWT_SECRET);

            req.currentUser = await this.userService.findById(
                decoded.id,
            );
            // console.log('HIii hello');
            // console.log(req.currentUser);

            next();
        } catch (error) {
            throw new UnauthorizedException('Invalid Token');
        }
    }
}
