import {
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
        // return await this.repo.findOne({ where: { email } });
    }

    async findById(id: string) {
        const user = await this.repo
            .createQueryBuilder('user')
            .where('user.id = :id', { id })
            .getOne();
        return user;
        // return await this.repo.findOne({ where: { id } });
    }

    async getAllUsers() {
        const ordersC = await this.cacheManager.get('Users');
        console.log('before cache return');
        if (ordersC) {
            return ordersC;
        }

        const users = await this.repo
            .createQueryBuilder('user')
            .getMany();

        await this.cacheManager.set(
            'Users',
            JSON.stringify(users),
            0,
        );
        return users;
    }

    async deleteUserById(id) {
        try {
            const user = await this.findById(id);
            if (!user)
                throw new NotFoundException(
                    `User with ID "${id}" not found`,
                );
        } catch (error) {
            console.log('User Id not found');
            throw new NotFoundException(`User Id not found`);
        }

        return await this.repo
            .createQueryBuilder()
            .delete()
            .where('id = :id', { id })
            .execute();
        // return await this.repo.delete(id);
    }
}
