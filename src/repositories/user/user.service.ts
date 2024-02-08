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

    async getAllUsers() {
        const users = await this.repo
            .createQueryBuilder('user')
            .getMany();
        const mappedUsers = users.map((user) =>
            this.dbObjectToUser(user),
        );
        return mappedUsers;
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
