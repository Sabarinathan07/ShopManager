import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthValidator } from 'src/helpers/auth.validator';

@Module({
    imports: [TypeOrmModule.forFeature([User]), ConfigModule],

    providers: [AuthService, AuthValidator],
    controllers: [AuthController],
})
export class AuthModule {}
