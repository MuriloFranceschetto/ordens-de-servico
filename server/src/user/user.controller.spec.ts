import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository, UpdateResult } from "typeorm";
import { MockType } from "test/mock-type";
import { UserRole } from "./user-role";
import { CreateUserDto } from "./dto/CreateUser.dto";
import { plainToClass } from "class-transformer";
import { UpdateUserDto } from "./dto/UpdateUser.dto";
import { validate } from "class-validator";

export const repositoryMockFactory: () => MockType<Repository<UserEntity>> = jest.fn(() => ({
    findOne: jest.fn(entity => entity),
    find: jest.fn(entity => entity),
    save: jest.fn(entity => null),
    update: jest.fn(entity => null),
    delete: jest.fn(entity => null),
}));

const clientUser: UserEntity = {
    id: crypto.randomUUID(),
    name: 'Murilo',
    email: 'gfmurilogf@gmail.com',
    password: "123123123",
    active: false,
    pricePerHour: 0,
    roles: [UserRole.Client],
    createdAt: undefined,
    updatedAt: undefined,
    deletedAt: undefined
};

const workerUser: UserEntity = {
    id: null,
    name: 'Murilo',
    email: 'gfmurilogf@gmail.com',
    password: "123123123",
    active: false,
    pricePerHour: 0,
    roles: [UserRole.Worker, UserRole.Admin],
    createdAt: undefined,
    updatedAt: undefined,
    deletedAt: undefined
};

describe('UserService', () => {

    let userService: UserService;
    let repositoryMock: MockType<Repository<UserEntity>>;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                UserService,
                { provide: getRepositoryToken(UserEntity), useFactory: repositoryMockFactory }
            ],
        }).compile();

        userService = moduleRef.get<UserService>(UserService);
        repositoryMock = moduleRef.get(getRepositoryToken(UserEntity));
    });

    it('should get list with all users', async () => {
        const users = [clientUser];
        repositoryMock.find.mockReturnValue(users);
        expect(await userService.listUsers()).toEqual(users);
        expect(repositoryMock.find).toHaveBeenCalled();
    });

    it('should find a user by ID', async () => {
        repositoryMock.findOne.mockReturnValue(clientUser);
        expect(await userService.getUserById(clientUser.id)).toEqual(clientUser);
        expect(repositoryMock.findOne).toHaveBeenCalledWith({ where: { id: clientUser.id } });
    });

    it('should find a user by email', async () => {
        repositoryMock.findOne.mockReturnValue(clientUser);
        expect(await userService.getUserByEmail(clientUser.email)).toEqual(clientUser);
        expect(repositoryMock.findOne).toHaveBeenCalledWith({ where: { email: clientUser.email } });
    });

    it('should verify if user exists by his ID - Success', async () => {
        repositoryMock.findOne.mockReturnValue(clientUser);
        expect(await userService.verifyUserById(clientUser.id)).toEqual(clientUser);
        expect(repositoryMock.findOne).toHaveBeenCalledWith({ where: { id: clientUser.id } });
    });

    it('should verify if user exists by his ID - Fail', async () => {
        repositoryMock.findOne.mockReturnValue(null);
        try {
            await userService.verifyUserById(clientUser.id);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect(e).toHaveProperty('message', 'Não existe usuário com este identificador');
        }
        expect(repositoryMock.findOne).toHaveBeenCalledWith({ where: { id: clientUser.id } });
    });

    it('should verify if user is a client - Success', async () => {
        expect(await userService.verifyIfUserIsClient(clientUser));
    });

    it('should verify if user is a client - Fail', async () => {
        try {
            await userService.verifyIfUserIsClient(workerUser);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect(e).toHaveProperty('message', `O cadastro de "${workerUser.name}" não é referente a um cliente`);
        }
    });

    it('should create new user', async () => {
        repositoryMock.save.mockReturnValue(clientUser);
        let newUser: CreateUserDto = plainToClass(CreateUserDto, clientUser);
        const createdUser = await userService.createUser(newUser);
        expect(createdUser).toBeInstanceOf(UserEntity);
        expect(createdUser).toHaveProperty('id');
        expect(repositoryMock.save).toHaveBeenCalledTimes(1);
    });

    it('should update existing user', async () => {
        repositoryMock.update.mockReturnValue(new UpdateResult());
        let userToUpdate: UpdateUserDto = plainToClass(UpdateUserDto, clientUser, {
            strategy: "excludeAll",
        });
        await userService.updateUser(clientUser.id, userToUpdate);
        expect(repositoryMock.update).toHaveBeenCalledWith(clientUser.id, userToUpdate);
    });

    it('should update existing user without password', async () => {
        repositoryMock.update.mockReturnValue(new UpdateResult());
        let userToUpdate: UpdateUserDto = plainToClass(UpdateUserDto, clientUser, {
            strategy: "excludeAll",
        });
        delete userToUpdate.password;
        await userService.updateUser(clientUser.id, userToUpdate);
        expect(repositoryMock.update).toHaveBeenCalledWith(clientUser.id, userToUpdate);
    });

    it('should delete existing user', async () => {
        repositoryMock.delete.mockReturnValue(clientUser);
        expect(await userService.deleteUser(clientUser.id)).toEqual(clientUser);
        expect(repositoryMock.delete).toHaveBeenCalledWith(clientUser.id);
    });

    it('should password be required when user has role ADMIN - DTO Classes', async () => {
        let user: Partial<CreateUserDto> = {
            password: null,
            roles: [UserRole.Admin]
        }
        let userDTO = plainToClass(CreateUserDto, user);
        const errors = await validate(userDTO, { skipUndefinedProperties: true, });
        expect(errors.length).toBe(1);
        expect(errors[0]).toHaveProperty('property', 'password');
    });

    it("should password not be required when user isn't ADMIN - DTO Classes", async () => {
        let user: Partial<CreateUserDto> = {
            password: null,
            roles: [UserRole.Worker, UserRole.Client]
        }
        let userDTO = plainToClass(CreateUserDto, user);
        const errors = await validate(userDTO, { skipMissingProperties: true });
        expect(errors.length).toBe(0);
    });

});

