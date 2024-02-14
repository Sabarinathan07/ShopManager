import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../microservices/user/entity/user.entity';
import { UserValidator } from '../../microservices/user/helpers/user.validator';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserService, UserValidator],
    exports: [UserService],
    controllers: [UserController],
})
export class UserModule {}
