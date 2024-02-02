import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dtos/createUser.dto';
import { LoginUserDto } from 'src/dtos/loginUser.dto';
import { customRequest } from 'src/interfaces/request.interface';

@Controller('/api')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('/register')
    async createUser(@Body() body: CreateUserDto) {
        return await this.userService.createUser(body);
    }

    @HttpCode(200)
    @Post('/login')
    async loginUser(@Body() body: LoginUserDto) {
        return await this.userService.login(body);
    }

    @Get('/user')
    // @UseGuards(AuthGuard())
    async getUser(@Req() req: customRequest) {
        return req.currentUser;
    }

    @Delete('/:id')
    async deleteUserById(@Param() id: string) {
        console.log(id);
        return await this.userService.deleteUserById(id);
    }
}
