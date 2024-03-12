import { SubserviceService } from './subservice.service';
import { SubserviceController } from './subservice.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubserviceEntity } from './subservice.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([SubserviceEntity]),
    ],
    controllers: [
        SubserviceController,
    ],
    providers: [
        SubserviceService,
    ],
})
export class SubserviceModule { }
