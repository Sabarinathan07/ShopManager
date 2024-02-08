import {
    Body,
    Controller,
    Post,
    HttpCode,
    Res,
    UseInterceptors,
    Inject,
    Req,
} from '@nestjs/common';
import { UserInterface } from 'src/interfaces/user.interface';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthInterceptor } from 'src/Interceptor/auth.interceptor';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { customRequest } from 'src/interfaces/request.interface';

@Controller('/api')
@UseInterceptors(AuthInterceptor)
export class AuthController {
    constructor(
        private authService: AuthService,
        @Inject(CACHE_MANAGER) private cacheManager,
    ) {}
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
    async logoutUser(
        @Res({ passthrough: true }) response: Response,
        // @Req() req: customRequest,
    ) {
        response.clearCookie('token');
        // await this.cacheManager.reset();
        // const keys = await this.cacheManager.keys;
        // console.log(await this.cacheManager.store);

        // await this.cacheManager.del('usersc');
        return { message: 'Logged out' };
    }
}
