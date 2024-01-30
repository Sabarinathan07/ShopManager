/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { OrderModule } from './order/order.module';
import { AppDataSource } from './database/config';

@Module({
  imports: [UserModule, ItemModule, OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    AppDataSource.initialize()
      .then(() => console.log('Database connected'))
      .catch((err) => {
        console.log(err);
        process.exit(1);
      });
  }
}

// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [],
  
// })
// export class AppModule {}