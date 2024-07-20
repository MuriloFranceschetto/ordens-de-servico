import { SubserviceService } from './subservice.service';
import { SubserviceController } from './subservice.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubserviceEntity } from './subservice.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([SubserviceEntity]),
        JwtModule,
    ],
    controllers: [
        SubserviceController,
    ],
    providers: [
        SubserviceService,
    ],
})
export class SubserviceModule { }
