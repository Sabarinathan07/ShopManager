import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from 'src/middleware/auth.middleware';

@Module({
    imports: [TypeOrmModule.forFeature([User]), ConfigModule],
    providers: [UserService],
    exports: [UserService],
    controllers: [UserController],
})
export class UserModule {
    // configure(consumer: MiddlewareConsumer) {
    //     consumer.apply(AuthMiddleware).forRoutes('api/user');
    // }
}
