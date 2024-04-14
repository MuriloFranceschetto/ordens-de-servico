import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ListUserDto } from './dto/UserList.dto';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { UserService } from './user.service';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ResponseUserDto } from './dto/response-user.dto';

@Controller('/api/users')
export class UserController {

    constructor(
        private userService: UserService,
    ) {
    }

    @Get()
    async getUsers() {
        return await this.userService.listUsers();
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
            message: 'Successfull user creation!'
        };
    }

    @Put('/:id')
    async updateUser(@Param('id') id: string, @Body() userData: UpdateUserDto) {
        await this.userService.updateUser(id, userData);
        return {
            message: 'Successfull user update!'
        };
    }

    @Delete('/:id')
    async deleteUser(@Param('id') id: string) {
        let deleteResult = await this.userService.deleteUser(id);
        return {
            deleteResult,
            message: 'Successfull user delete!'
        };
    }

}