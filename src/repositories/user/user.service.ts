import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/createUser.dto';
import { User } from 'src/entity/user.entity';
import { AuthService } from 'src/helpers/AuthService';
import { Role } from 'src/enums/Role';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto } from 'src/dtos/loginUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private repo: Repository<User>,
    ) {}

    async createUser(body: CreateUserDto) {
        const users = await this.findByEmail(body.email);
        if (users) {
            throw new BadRequestException('email in use');
        }
        const hashPass = await AuthService.encryptPass(body.password);
        const newUser = new User();
        newUser.name = body.name;
        newUser.email = body.email;
        newUser.password = hashPass;
        newUser.role = body.role as Role;

        const user = this.repo.create(newUser);
        return this.repo.save(user);
    }

    async login(body: LoginUserDto) {
        const { email, password } = body;
        const user = await this.findByEmail(email);

        if (!user) {
            throw new NotFoundException('User not found');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new NotFoundException('Invalid credentials');
        }

        const id = user.id;
        const token = await AuthService.generateToken({ id: id });
        return { user, token };
    }

    async findByEmail(email: string) {
        return await this.repo.findOne({ where: { email } });
    }

    async findById(id: string) {
        try {
            return await this.repo.find({ where: { id } });
        } catch (error) {
            throw new NotFoundException(
                `User with ID "${id}" not found`,
            );
        }
    }
    async deleteUserById(id) {
        const user = await this.findById(id.id);
        if (!user) {
            throw new NotFoundException(
                `User with ID "${id.id}" not found`,
            );
        }
        return await this.repo.delete(id);
    }
}
