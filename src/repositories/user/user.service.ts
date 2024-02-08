import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInterface } from 'src/interfaces/user.interface';
import { customRequest } from 'src/interfaces/request.interface';

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
    async getCurrentUser(req: customRequest) {
        return this.dbObjectToUser(req.currentUser);
    }

    async getAllUsers() {
        // const ordersC = await this.cacheManager.get('userc');
        // if (ordersC) {
        //     return ordersC;
        // }
        // console.log(ordersC);

        const users = await this.repo
            .createQueryBuilder('user')
            .getMany();

        // await this.cacheManager.set(
        //     'usersc',
        //     JSON.stringify(users),
        //     0,
        // );

        // const mappedUsers = users.map((user) =>
        //     this.dbObjectToUser(user),
        // );
        return this.mapUsers(users);
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
        // return await this.repo.delete(id);
    }

    private mapUsers(users: User[]) {
        const mappedUsers = users.map((user) =>
            this.dbObjectToUser(user),
        );
        return mappedUsers;
    }

    private dbObjectToUser(user: User): UserInterface {
        const { id, name, email, role } = user;
        return <UserInterface>{ id, name, email, role };
    }
}
