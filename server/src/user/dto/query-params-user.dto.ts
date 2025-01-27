import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";

import { UserRole } from "../user-role";
import { Transform } from "class-transformer";
import {PaginationRequestDto} from "../../shared/pipes/pagination-transform.pipe";

export class QueryParamsUserDto extends PaginationRequestDto {

    @IsOptional()
    @IsString()
    public readonly name: string;

    @IsOptional()
    @Transform(({ value }) => {
        if (!Array.isArray(value)) {
            return [value]
        } else {
            return value;
        }
    })
    @IsArray()
    @IsEnum(UserRole, { each: true })
    public readonly roles: Array<UserRole>;

    @IsOptional()
    @Transform(({ obj, key }) => obj[key] === 'true')
    @IsBoolean()
    public readonly show_inactives: boolean = false;

}