import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { User } from '../../../microservices/user/entity/user.entity';
import { Role } from '../../../microservices/user/enums/Role';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { payload } from '../../../microservices/auth/interfaces/payload.interface';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { UserInterface } from '../../../microservices/user/interfaces/user.interface';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private repo: Repository<User>,
    ) {}
    private jwtSecret = process.env.JWT_SECRET;

    async encryptPass(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    async generateToken(payload: payload): Promise<string> {
        const token = await jwt.sign(payload, this.jwtSecret, {
            expiresIn: '1d',
        });
        return token;
    }
    async findByEmail(email: string) {
        return await this.repo
            .createQueryBuilder('user')
            .where('user.email = :email', { email })
            .getOne();
    }

    async findById(id: string) {
        return await this.repo
            .createQueryBuilder('user')
            .where('user.id = :id', { id })
            .getOne();
    }
    async createUser(body: UserInterface, response: Response) {
        const users = await this.findByEmail(body.email);
        if (users) {
            throw new BadRequestException('email in use');
        }
        const hashPass = await this.encryptPass(body.password);
        const newUser = new User();
        newUser.name = body.name;
        newUser.email = body.email;
        newUser.password = hashPass;
        newUser.role = body.role as Role;

        const res = await this.repo
            .createQueryBuilder()
            .insert()
            .into(User)
            .values(newUser)
            .execute();

        const id = res.raw[0].id;
        const token = await this.generateToken({ id: id });
        response.cookie('token', token);
        const user = await this.findById(id);

        return this.dbObjectToUser(user);
    }

    async login(body: UserInterface, response: Response) {
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
        const token = await this.generateToken({ id: id });
        response.cookie('token', token);
        return this.dbObjectToUser(user);
    }

    private dbObjectToUser(user: User): UserInterface {
        const { id, name, email, role } = user;
        return <UserInterface>{ id, name, email, role };
    }
}
