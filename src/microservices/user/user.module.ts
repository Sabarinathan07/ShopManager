import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user-api/controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/microservices/user/entity/user.entity';
import { ConfigModule } from '@nestjs/config';
import { UserValidator } from 'src/microservices/user/helpers/user.validator';
import { UserApiModule } from './user-api/user-api.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        ConfigModule,
        UserApiModule,
    ],
    providers: [UserService, UserValidator],
    exports: [UserService],
    controllers: [UserController],
})
export class UserModule {}
