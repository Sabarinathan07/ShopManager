import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../microservices/user/entity/user.entity';
import { AuthValidator } from '../../microservices/auth/helpers/auth.validator';
import { UserService } from '../user/services/user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],

    providers: [AuthService, AuthValidator, UserService],
    controllers: [AuthController],
})
export class AuthModule {}
