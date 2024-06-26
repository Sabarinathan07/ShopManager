import {
    Body,
    Controller,
    Post,
    HttpCode,
    Res,
    UseInterceptors,
    UseGuards,
    HttpStatus,
} from '@nestjs/common';
import { UserInterface } from '../../../microservices/user/interfaces/';
import { AuthService } from '../services/';
import { Response } from 'express';
import { AuthInterceptor } from '../../../microservices/auth/interceptors/';
import { RateLimitGuard } from '../../../guards/';

@Controller('/api')
@UseInterceptors(AuthInterceptor)
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('/register')
    @UseGuards(RateLimitGuard)
    async createUser(
        @Body() body: UserInterface,
        @Res({ passthrough: true }) response: Response,
    ) {
        return await this.authService.createUser(body, response);
    }

    @HttpCode(HttpStatus.OK)
    @Post('/login')
    @UseGuards(RateLimitGuard)
    async loginUser(
        @Body() body: UserInterface,
        @Res({ passthrough: true }) response: Response,
    ) {
        const res = await this.authService.login(body, response);
        return res;
    }

    @Post('/logout')
    async logoutUser(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('token');
        return { message: 'Logged out' };
    }
}
