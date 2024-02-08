import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/repositories/user/entity/user.entity';
import { ConfigModule } from '@nestjs/config';
import { UserValidator } from 'src/repositories/user/helpers/user.validator';

@Module({
    imports: [TypeOrmModule.forFeature([User]), ConfigModule],
    providers: [UserService, UserValidator],
    exports: [UserService],
    controllers: [UserController],
})
export class UserModule {}
