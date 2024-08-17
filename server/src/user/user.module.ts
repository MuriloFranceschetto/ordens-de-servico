import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './user.entity';
import { UserController } from './user.controller';
import { UniqueEmailValidator } from './validators/uniqueEmail.validator';
import { HashingService } from 'src/globals/services/hashing.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule,
    ],
    controllers: [UserController],
    providers: [
        UniqueEmailValidator,
        UserService,
        HashingService,
    ],
    exports: [
        UserService,
    ]
})
export class UserModule { }
