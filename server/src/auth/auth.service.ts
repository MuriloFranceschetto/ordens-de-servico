import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/user/user-role';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.userService.getUserByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Usuário não encontrado');
        }
        if (!user.roles.includes(UserRole.Admin)) {
            throw new UnauthorizedException('Usuário não tem permissão de administrador');
        }
        if (user?.password !== pass) {
            throw new UnauthorizedException('Senha incorreta');
        }

        const { password, ...result } = user;
        return {
            access_token: await this.jwtService.signAsync(result),
        };
    }

}
