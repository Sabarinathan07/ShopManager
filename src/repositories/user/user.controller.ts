import { User } from './../../entity/user.entity';
import { Controller, Delete, Get, Param, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { customRequest } from 'src/interfaces/request.interface';

@Controller('/api')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('/user')
    // @UseGuards(AuthGuard())
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
