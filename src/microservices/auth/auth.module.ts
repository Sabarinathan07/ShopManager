import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth-api/controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/microservices/user/entity/user.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthValidator } from 'src/microservices/auth/helpers/auth.validator';
import { UserService } from '../user/services/user.service';
import { AuthApiModule } from './auth-api/auth-api.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        ConfigModule,
        AuthApiModule,
    ],

    providers: [AuthService, AuthValidator, UserService],
    controllers: [AuthController],
})
export class AuthModule {}
