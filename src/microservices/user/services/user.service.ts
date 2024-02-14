import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { User } from '../../../microservices/user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInterface } from '../../../microservices/user/interfaces/user.interface';
import { customRequest } from '../../../microservices/user/interfaces/request.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private repo: Repository<User>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async findByEmail(email: string) {
        const user = await this.repo
            .createQueryBuilder('user')
            .where('user.email = :email', { email })
            .getOne();
        return user;
    }

    async findById(id: string) {
        const user = await this.repo
            .createQueryBuilder('user')
            .where('user.id = :id', { id })
            .getOne();
        return user;
    }
    async getCurrentUser(req: customRequest) {
        return this.dbObjectToUser(req.currentUser);
    }

    // async getAllUsers() {
    //     const users = await this.repo
    //         .createQueryBuilder('user')
    //         .getMany();
    //     const mappedUsers = users.map((user) =>
    //         this.dbObjectToUser(user),
    //     );
    //     return mappedUsers;
    // }

    async getAllUsers() {
        // await this.cacheManager.reset();
        const ordersC = await this.cacheManager.get('Users');
        console.log('before cache return');
        if (ordersC) {
            return ordersC;
        }
        console.log('after cache return');

        const users = await this.repo
            .createQueryBuilder('user')
            .getMany();

        await this.cacheManager.set('Users', users, 0);
        return users;
    }

    async deleteUserById(id: string) {
        const user = await this.findById(id);
        if (!user) throw new NotFoundException('User not Found');

        const res = await this.repo
            .createQueryBuilder()
            .delete()
            .where('id = :id', { id })
            .execute();

        if (res.affected == 1)
            return { message: 'User deleted successfully' };
        else
            throw new InternalServerErrorException(
                'Failed to delete User',
            );
    }

    private dbObjectToUser(user: User): UserInterface {
        const { id, name, email, role } = user;
        return <UserInterface>{ id, name, email, role };
    }
}
