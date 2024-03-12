import { UserRole } from "../user-role";

export class UserListDto {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly roles: UserRole[],
        readonly active: boolean,
    ) { }
}