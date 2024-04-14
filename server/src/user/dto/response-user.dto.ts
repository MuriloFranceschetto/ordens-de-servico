import { Expose } from "class-transformer";
import { UserRole } from "../user-role";
import { IsArray, IsCurrency } from "class-validator";

export class ResponseUserDto {

    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    email: string;

    @Expose()
    active: boolean;

    @IsCurrency()
    @Expose()
    pricePerHour: number;

    @IsArray()
    @Expose()
    roles: UserRole[];

    @Expose()
    createdAt: string;

    @Expose()
    updatedAt: string;

    @Expose()
    deletedAt: string;

}