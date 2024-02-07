import {
    Body,
    Controller,
    Post,
    HttpCode,
    Res,
    UseInterceptors,
} from '@nestjs/common';
import { UserInterface } from 'src/interfaces/user.interface';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthInterceptor } from 'src/Interceptor/auth.interceptor';

@Controller('/api')
@UseInterceptors(AuthInterceptor)
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('/register')
    async createUser(@Body() body: UserInterface) {
        return await this.authService.createUser(body);
    }

    @HttpCode(200)
    @Post('/login')
    async loginUser(
        @Body() body: UserInterface,
        @Res({ passthrough: true }) response: Response,
    ) {
        const res = await this.authService.login(body);
        response.cookie('token', res.token);

        // session.userId = res.token;
        return res;
    }

    @Post('/logout')
    async logoutUser(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('token');
        return { message: 'Logged out' };
    }
}
