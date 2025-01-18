import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { QueryParamsUserDto } from './dto/query-params-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ListUserDto } from './dto/user-list.dto';
import { UserService } from './user.service';

@Controller('/api/users')
@UseGuards(AuthGuard)
export class UserController {

    constructor(
        private userService: UserService,
    ) {
    }

    @Get()
    @UsePipes(new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
    }))
    async getUsers(
        @Query() queryParams: QueryParamsUserDto,
    ) {
        return await this.userService.listUsers(queryParams);
    }

    @Get('/:id')
    async getUsersById(@Param('id') id: string) {
        let user = await this.userService.getUserById(id);
        return plainToInstance(ResponseUserDto, user);
    }

    @Post()
    async createUser(@Body() userData: CreateUserDto) {
        const userEntity = await this.userService.createUser(userData);
        return {
            user: plainToClass(ListUserDto, userEntity),
            message: 'Successfully user creation!'
        };
    }

    @Put('/:id')
    async updateUser(@Param('id') id: string, @Body() userData: UpdateUserDto) {
        await this.userService.updateUser(id, userData);
        return {
            message: 'Successfully user update!'
        };
    }

    @Delete('/:id')
    async deleteUser(@Param('id') id: string) {
        let deleteResult = await this.userService.deleteUser(id);
        return {
            deleteResult,
            message: 'Successfully user delete!'
        };
    }

}