import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { payload } from 'src/dtos/payload.dto';

@Injectable()
export class AuthService {
    private static readonly jwtSecret =
        'c1yx9/MFM+Gr+3LFtjLYLTQK2@IXOAQPgx2bHReDWA9wy5Q8ilaUgRoxVloxYHoT';

    static async encryptPass(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    static async generateToken(payload: payload): Promise<string> {
        const token = await jwt.sign(payload, this.jwtSecret, {
            expiresIn: '1d',
        });
        return token;
    }
}
