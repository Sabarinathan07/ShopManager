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
import {
    CACHE_MANAGER,
    CacheInterceptor,
    CacheKey,
    CacheTTL,
} from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('/api')
@UseInterceptors(CacheInterceptor)
export class UserController {
    constructor(
        private userService: UserService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    @Get('/user')
    async getUser(@Req() req: customRequest) {
        return req.currentUser;
    }

    @CacheKey('custom_key')
    @CacheTTL(20)
    @Get('/all-users')
    async getAllUsers() {
        return await this.userService.getAllUsers();
    }

    @Delete('/:id')
    async deleteUserById(@Param('id') id: string) {
        return await this.userService.deleteUserById(id);
    }
}
