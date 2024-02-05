import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private repo: Repository<User>,
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
        // console.log('hi from user');
        // console.log(user);
        return user;
        // return await this.repo.findOne({ where: { id } });
    }
    async deleteUserById(id) {
        // console.log(id);
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
