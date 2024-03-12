import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsOptional, MinLength, ValidateIf } from "class-validator";
import { UserRole } from "../user-role";

export class UpdateUserDto {

    @IsOptional()
    name: string;

    @ValidateIf((obj: UpdateUserDto) => {
        return obj.roles.includes(UserRole.Admin)
    })
    @IsEmail(undefined, { message: 'E-mail incorreto para usuário do tipo "Administrador"' })
    email: string;

    @IsOptional()
    @MinLength(6, { message: 'Senha muito curta' })
    password: string;

    @IsNotEmpty({ message: 'The property role cannot be empty' })
    @IsArray({ context: UserRole })
    roles: UserRole[];

    @IsOptional()
    @IsBoolean()
    active: boolean;

    @ValidateIf((obj: UpdateUserDto) => {
        return obj.roles.includes(UserRole.Worker)
    })
    @IsNotEmpty({ message: 'Informe o "Valor da Hora" para usuários do tipo "Mecânico"' })
    pricePerHour: number;

}