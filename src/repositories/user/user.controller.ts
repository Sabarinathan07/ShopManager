import {
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { customRequest } from 'src/interfaces/request.interface';
import { CacheTTL } from '@nestjs/cache-manager';

@Controller('/api')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('/user')
    async getUser(@Req() req: customRequest) {
        return req.currentUser;
    }

    @Get('/all-users')
    async getAllUsers() {
        return await this.userService.getAllUsers();
    }

    @Delete('/:id')
    async deleteUserById(@Param('id') id: string) {
        return await this.userService.deleteUserById(id);
    }
}
