import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsOptional, MinLength, ValidateIf } from "class-validator";
import { UserRole } from "../user-role";

export class CreateUserDto {

    @IsNotEmpty({ message: 'The property name cannot be empty' })
    name: string;

    @ValidateIf((obj: CreateUserDto) => {
        return obj.roles.includes(UserRole.Admin)
    })
    @IsEmail(undefined, { message: 'E-mail incorreto para usuário do tipo "Administrador"' })
    email: string;

    @MinLength(6, { message: 'Esta senha ta mto pequena' })
    password: string;

    @IsNotEmpty({ message: 'The property role cannot be empty' })
    @IsArray({ each: true, context: UserRole })
    roles: UserRole[];

    @IsOptional()
    @IsBoolean()
    active: boolean;

    @ValidateIf((obj: CreateUserDto) => {
        return obj.roles.includes(UserRole.Worker)
    })
    @IsNotEmpty({ message: 'Informe o "Valor da Hora" para usuários do tipo "Mecânico"' })
    pricePerHour: number;

}