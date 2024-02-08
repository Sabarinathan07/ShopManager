import {
    Controller,
    Delete,
    Get,
    Param,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { customRequest } from 'src/interfaces/request.interface';
import { UserInterceptor } from 'src/Interceptor/user.interceptor';

@Controller('/api')
@UseInterceptors(UserInterceptor)
export class UserController {
    constructor(private userService: UserService) {}

    @Get('/user')
    async getUser(@Req() req: customRequest) {
        // console.log(req.cookies);
        return this.userService.getCurrentUser(req);
    }

    @Delete('/:id')
    async deleteUserById(@Param('id') id: string) {
        return await this.userService.deleteUserById(id);
    }

    @Get('/all-users')
    async getAllUsers() {
        return await this.userService.getAllUsers();
    }
}
