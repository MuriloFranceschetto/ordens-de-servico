import { randomUUID } from 'crypto';
import { Repository, UpdateResult } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from './user.entity';
import { ListUserDto } from './dto/UserList.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { CreateUserDto } from './dto/CreateUser.dto';
import { plainToClass } from 'class-transformer';
import { UserRole } from './user-role';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    ) { }

    async listUsers() {
        let users = await this.userRepository.find({ order: { id: 'ASC' } });
        return users.map((user) => plainToClass(ListUserDto, user));
    }

    async getUserById(id: string) {
        return await this.userRepository.findOne({
            where: {
                id,
            }
        });
    }

    async getUserByEmail(email: string) {
        return await this.userRepository.findOne({
            where: {
                email,
            }
        })
    }

    async verifyUserById(userId: string): Promise<UserEntity> {
        let user = await this.getUserById(userId);
        if (!user) {
            throw new Error('Não existe usuário com este identificador');
        }
        return user;
    }

    async verifyIfUserIsClient(user: UserEntity) {
        if (!user.roles.includes(UserRole.Client)) {
            throw new Error(`O cadastro de "${user.name}" não é referente a um cliente`);
        }
    }

    async verifyIfUserIsWorker(user: UserEntity) {
        if (!user.roles.includes(UserRole.Worker) && !user.roles.includes(UserRole.Third)) {
            throw new Error(`O cadastro de "${user.name}" não é referente a um mecânico ou terceiro`);
        }
    }

    async createUser(userData: CreateUserDto): Promise<UserEntity> {
        const userEntity = new UserEntity();
        userEntity.name = userData.name;
        userEntity.email = userData.email;
        userEntity.password = userData.password;
        userEntity.roles = userData.roles;
        userEntity.pricePerHour = userData.pricePerHour;
        userEntity.active = userData.active;
        userEntity.id = randomUUID();
        await this.userRepository.save(userEntity);
        return userEntity;
    }

    async updateUser(id: string, userEntity: UpdateUserDto): Promise<UpdateResult> {
        const updateUserEntity = new UpdateUserDto();
        updateUserEntity.name = userEntity.name;
        updateUserEntity.email = userEntity.email;
        updateUserEntity.roles = userEntity.roles;
        updateUserEntity.active = userEntity.active;
        updateUserEntity.pricePerHour = userEntity.pricePerHour;
        if (userEntity.password) {
            updateUserEntity.password = userEntity.password;
        } else {
            delete updateUserEntity.password;
        }
        return await this.userRepository.update(id, updateUserEntity);
    }

    async deleteUser(id: string) {
        return await this.userRepository.delete(id);
    }

}
