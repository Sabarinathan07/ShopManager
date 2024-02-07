import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { Role } from 'src/enums/Role';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { payload } from 'src/dtos/payload.dto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { UserInterface } from 'src/interfaces/user.interface';
dotenv.config();

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
        // return await this.repo.findOne({ where: { email } });
    }
    async createUser(body: UserInterface) {
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

        const user = this.repo
            .createQueryBuilder()
            .insert()
            .into(User)
            .values(newUser)
            .execute();

        return user;

        // const user = this.repo.create(newUser);
        // return this.repo.save(user);
    }

    async login(body: UserInterface) {
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
        return { user, token };
    }
}
