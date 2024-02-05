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
        return req.currentUser;
    }

    @Delete('/:id')
    async deleteUserById(@Param() idO) {
        const id = idO.id;
        return await this.userService.deleteUserById(id);
    }
}
