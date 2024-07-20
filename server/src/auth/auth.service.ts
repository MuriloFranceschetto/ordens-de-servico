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
        if (!user.roles.includes(UserRole.Admin)) {
            throw new UnauthorizedException();
        }
        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }

        const { password, ...result } = user;
        return {
            access_token: await this.jwtService.signAsync(result),
        };
    }

}
