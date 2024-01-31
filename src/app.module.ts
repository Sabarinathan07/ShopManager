import { DbModule } from './database/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from './repositories/item/item.module';
import { UserModule } from './repositories/user/user.module';
import { OrderModule } from './repositories/order/order.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env`,
        }),
        DbModule, // Use the DatabaseModule here
        UserModule,
        ItemModule,
        OrderModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
