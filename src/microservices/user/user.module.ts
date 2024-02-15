import { Module } from '@nestjs/common';
import { UserService } from './services/';
import { UserController } from './controllers/';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../microservices/user/entity/';
import { UserValidator } from '../../microservices/user/helpers/';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserService, UserValidator],
    exports: [UserService],
    controllers: [UserController],
})
export class UserModule {}
