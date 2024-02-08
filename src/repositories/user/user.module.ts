import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { ConfigModule } from '@nestjs/config';
import { UserValidator } from 'src/helpers/user.validator';

@Module({
    imports: [TypeOrmModule.forFeature([User]), ConfigModule],
    providers: [UserService, UserValidator],
    exports: [UserService],
    controllers: [UserController],
})
export class UserModule {}
