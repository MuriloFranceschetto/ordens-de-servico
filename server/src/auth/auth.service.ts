/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PersonService } from 'src/person/person.service';
import { UnauthorizedException } from '@nestjs/common/exceptions'

@Injectable()
export class AuthService {
    
    constructor(private personService: PersonService) {
    }
    
    async signIn(login: string, pass: string): Promise<any> {
        const user: person = await this.personService.findByLogin(login);
        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }
        const { password, ...result } = user;
        // TODO: Generate a JWT and return it here
        // instead of the user object
        return result;
    }
    
}
