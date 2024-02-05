import {
    Body,
    Controller,
    Post,
    HttpCode,
    Session,
    Res,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/createUser.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/dtos/loginUser.dto';
import { Response } from 'express';

@Controller('/api')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('/register')
    async createUser(@Body() body: CreateUserDto) {
        return await this.authService.createUser(body);
    }

    @HttpCode(200)
    @Post('/login')
    async loginUser(
        @Body() body: LoginUserDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        const res = await this.authService.login(body);
        response.cookie('token', res.token);

        // session.userId = res.token;
        return res;
    }
}
