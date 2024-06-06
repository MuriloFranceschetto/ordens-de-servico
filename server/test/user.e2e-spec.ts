// import supertest from 'supertest';

// import { Test } from "@nestjs/testing";
// import { INestApplication } from "@nestjs/common"
// import { DeleteResult, UpdateResult } from "typeorm";

// import { UserEntity } from 'src/user/user.entity';
// import { UserModule } from "src/user/user.module";
// import { UserService } from "src/user/user.service";
// import { ListUserDto } from "src/user/dto/UserList.dto";
// import { CreateUserDto } from "src/user/dto/CreateUser.dto";
// import { UpdateUserDto } from "src/user/dto/UpdateUser.dto";

// class UserServiceTests {
//     async listUsers(): Promise<ListUserDto[]> {
//         return [];
//     }
//     async createUser(userData: CreateUserDto): Promise<UserEntity> {
//         return;
//     }
//     async deleteUser(id: string): Promise<DeleteResult> {
//         return;
//     }
//     async getUserByEmail(email: string): Promise<UserEntity> {
//         return;
//     }
//     async getUserById(id: string): Promise<UserEntity> {
//         return;
//     }
//     async updateUser(id: string, userEntity: UpdateUserDto): Promise<UpdateResult> {
//         return;
//     }
//     async verifyIfUserIsClient(user: UserEntity): Promise<void> {
//         return;
//     }
//     async verifyUserById(userId: string): Promise<UserEntity> {
//         return;
//     }
// }

// describe('User', () => {
//     let app: INestApplication;
//     let userService = new UserServiceTests();

//     beforeAll(async () => {
//         const moduleRef = await Test.createTestingModule({ imports: [UserModule] })
//             .overrideProvider(UserService)
//             .useClass(UserServiceTests)
//             .compile();

//         app = moduleRef.createNestApplication();
//         await app.init();
//     });

//     it(`/GET /api/users`, () => {
//         return supertest(app.getHttpServer())
//             .get('/api/users')
//             .expect(200)
//             .expect({
//                 data: userService.listUsers(),
//             });
//     });

//     afterAll(async () => {
//         await app.close();
//     });

// })