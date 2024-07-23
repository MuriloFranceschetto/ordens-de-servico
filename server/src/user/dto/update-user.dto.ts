import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsOptional, MinLength, ValidateIf } from "class-validator";
import { UserRole } from "../user-role";
import { Expose } from "class-transformer";

export class UpdateUserDto {

    @Expose()
    @IsOptional()
    name: string;

    @Expose()
    @ValidateIf((obj: UpdateUserDto) => {
        return obj.roles.includes(UserRole.Admin)
    })
    @IsEmail(undefined, { message: 'E-mail incorreto para usuário do tipo "Administrador"' })
    email: string;

    @Expose()
    @ValidateIf((obj: UpdateUserDto) => {
        return obj.roles.includes(UserRole.Admin) && !!obj.password;
    })
    @MinLength(6, { message: 'Esta senha é muito curta' })
    password: string;

    @Expose()
    @IsNotEmpty({ message: 'The property role cannot be empty' })
    @IsArray({ context: UserRole })
    roles: UserRole[];

    @Expose()
    @IsOptional()
    @IsBoolean()
    active: boolean;

    @Expose()
    @ValidateIf((obj: UpdateUserDto) => {
        return obj.roles.includes(UserRole.Worker)
    })
    @IsNotEmpty({ message: 'Informe o "Valor da Hora" para usuários do tipo "Mecânico"' })
    pricePerHour: number;

}