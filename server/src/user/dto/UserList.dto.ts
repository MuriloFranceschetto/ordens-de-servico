import { Expose } from "class-transformer";
import { UserRole } from "../user-role";

export class ListUserDto {

    @Expose()
    public id: string;

    @Expose()
    public name: string;

    @Expose()
    public roles: UserRole[];

    @Expose()
    public active: boolean;
}