import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class HashingService {

    /**
     * Create password hash for new or edited users
     * @param password New user password
     * @returns 
     */
    public generatePasswordHash(password: string): [string, string] {
        const salt = randomBytes(10).toString('hex').slice(0, 10);
        return [
            salt,
            this._generateHash(password, salt),
        ];
    }

    public checkSaltedPassword(password: string, salt: string, storedHash: string): boolean {
        let hash = this._generateHash(password, salt);
        return hash === storedHash;
    }

    private _generateHash(password: string, salt?: string) {
        if (!salt)
            salt = '';
        return createHash('sha256').update(salt + password).digest('hex');
    }

}
