import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserListDto } from './dto/UserList.dto';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { UserService } from './user.service';

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
        return await this.userService.getUserById(id);
    }

    @Post()
    async createUser(@Body() userData: CreateUserDto) {
        const userEntity = await this.userService.createUser(userData);
        return {
            user: new UserListDto(userEntity.id, userEntity.name, userEntity.roles, userEntity.active),
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