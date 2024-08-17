import { randomUUID } from 'crypto';
import { Repository, UpdateResult } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from './user.entity';
import { ListUserDto } from './dto/user-list.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToClass } from 'class-transformer';
import { UserRole } from './user-role';
import { QueryParamsUserDto } from './dto/query-params-user.dto';
import { HashingService } from 'src/globals/services/hashing.service';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        private hashingService: HashingService,
    ) { }

    async listUsers(queryParams: Partial<QueryParamsUserDto>) {

        let query = this.userRepository
            .createQueryBuilder('user')
            .skip(queryParams.page * queryParams.limit)
            .take(queryParams.limit);

        if (!queryParams.show_inactives) {
            query.andWhere('user.active = true');
        }

        if (queryParams.name) {
            query.andWhere('user.name ILIKE :name', { name: `%${queryParams.name}%` });
        }

        if (queryParams?.roles?.length) {
            query.andWhere("user.roles && :roles", { roles: queryParams.roles });
        }
        let [users, count] = await query.getManyAndCount();
        return {
            users: users.map((user) => plainToClass(ListUserDto, user)),
            total: count,
        }
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
        userEntity.roles = userData.roles;
        userEntity.pricePerHour = userData.pricePerHour;
        userEntity.active = userData.active;
        userEntity.id = randomUUID();

        const [salt, hashPassword] = this.hashingService.generatePasswordHash(userData.password);
        userEntity.salt = salt;
        userEntity.password = hashPassword;

        await this.userRepository.save(userEntity);
        return userEntity;
    }

    async updateUser(id: string, userData: UpdateUserDto): Promise<UpdateResult> {
        const updateUserEntity = new UserEntity();
        updateUserEntity.name = userData.name;
        updateUserEntity.email = userData.email;
        updateUserEntity.roles = userData.roles;
        updateUserEntity.active = userData.active;
        updateUserEntity.pricePerHour = userData.pricePerHour;
        if (userData.password) {
            const [salt, hashPassword] = this.hashingService.generatePasswordHash(userData.password);
            updateUserEntity.salt = salt;
            updateUserEntity.password = hashPassword;
        } else {
            delete updateUserEntity.password;
        }
        return await this.userRepository.update(id, updateUserEntity);
    }

    async deleteUser(id: string) {
        return await this.userRepository.delete(id);
    }

}
