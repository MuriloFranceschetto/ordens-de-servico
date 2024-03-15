import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostgresConfigService } from 'config/postgres.config.service';
import { SubserviceModule } from './subservice/subservice.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    UserModule,
    SubserviceModule,
    OrderModule,

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env'
    }),

    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService]
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
