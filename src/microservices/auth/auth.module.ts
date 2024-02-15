import { Module } from '@nestjs/common';
import { AuthService } from './services/';
import { AuthController } from './controllers/';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../microservices/user/entity/';
import { AuthValidator } from '../../microservices/auth/helpers/';
import { UserService } from '../user/services/';

@Module({
    imports: [TypeOrmModule.forFeature([User])],

    providers: [AuthService, AuthValidator, UserService],
    controllers: [AuthController],
})
export class AuthModule {}
