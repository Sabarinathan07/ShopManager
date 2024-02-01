import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { payload } from 'src/dtos/payload.dto';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthService {
    private static jwtSecret = process.env.JWT_SECRET;

    static async encryptPass(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    static async generateToken(payload: payload): Promise<string> {
        const token = await jwt.sign(payload, AuthService.jwtSecret, {
            expiresIn: '1d',
        });
        return token;
    }
}
