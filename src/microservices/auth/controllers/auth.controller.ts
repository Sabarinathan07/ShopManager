import {
    Body,
    Controller,
    Post,
    HttpCode,
    Res,
    UseInterceptors,
    UseGuards,
} from '@nestjs/common';
import { UserInterface } from 'src/microservices/user/interfaces/user.interface';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import { AuthInterceptor } from 'src/microservices/auth/interceptors/auth.interceptor';
import { RateLimitGuard } from 'src/guards/RateLimitGuard';

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

    @HttpCode(200)
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
