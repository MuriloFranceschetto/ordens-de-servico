import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './user.entity';
import { UserController } from './user.controller';
import { UniqueEmailValidator } from './validators/uniqueEmail.validator';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule,
    ],
    controllers: [UserController],
    providers: [
        UniqueEmailValidator,
        UserService,
    ],
    exports: [
        UserService,
    ]
})
export class UserModule { }
