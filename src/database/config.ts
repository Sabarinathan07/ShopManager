import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Item } from 'src/repositories/item/entity/item.entity';
import { Order } from 'src/repositories/order/entity/order.entity';
import { User } from 'src/repositories/user/entity/user.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    type: 'postgres',
                    host: config.get<string>('DB_HOST'),
                    port: config.get<number>('DB_PORT'),
                    username: config.get<string>('DB_USER'),
                    password: config.get<string>('DB_PASS'),
                    database: config.get<string>('DB_NAME'),
                    synchronize: true,
                    entities: [User, Item, Order],
                };
            },
        }),
    ],
})
export class DbModule {}
