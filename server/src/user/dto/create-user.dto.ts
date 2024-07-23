import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsOptional, MinLength, ValidateIf } from "class-validator";
import { UserRole } from "../user-role";
import { Expose } from "class-transformer";

export class CreateUserDto {

    @Expose()
    @IsNotEmpty({ message: 'The property name cannot be empty' })
    name: string;

    @Expose()
    @ValidateIf((obj: CreateUserDto) => {
        return obj.roles.includes(UserRole.Admin)
    })
    @IsEmail(undefined, { message: 'E-mail incorreto para usuário do tipo "Administrador"' })
    email: string;

    @Expose()
    @ValidateIf((obj: CreateUserDto) => {
        return obj.roles.includes(UserRole.Admin);
    })
    @IsNotEmpty({ message: 'Informe uma senha para o usuário se ele é do tipo "Administrador"' })
    @MinLength(6, { message: 'Esta senha é muito curta' })
    password: string;

    @Expose()
    @IsNotEmpty({ message: 'The property role cannot be empty' })
    @IsArray()
    roles: UserRole[];

    @Expose()
    @IsOptional()
    @IsBoolean()
    active: boolean;

    @Expose()
    @ValidateIf((obj: CreateUserDto) => {
        return obj.roles.includes(UserRole.Worker)
    })
    @IsNotEmpty({ message: 'Informe o "Valor da Hora" para usuários do tipo "Mecânico"' })
    pricePerHour: number;

}