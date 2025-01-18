import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserRole } from 'src/user/user-role';
import { UserService } from 'src/user/user.service';
import { HashingService } from 'src/globals/services/hashing.service';

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private hashingService: HashingService,
    ) { }

    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.userService.getUserByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Usuário não encontrado');
        }
        if (!user.roles.includes(UserRole.Admin)) {
            throw new UnauthorizedException('Usuário não tem permissão de administrador');
        }
        // if (!this.hashingService.checkSaltedPassword(pass, user.salt, user.password)) {
        //     throw new UnauthorizedException('Senha incorreta');
        // }

        const { password, ...result } = user;
        return {
            access_token: await this.jwtService.signAsync(result),
        };
    }

}
