import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return JSON.stringify({
            message:
                'Hello World! Welcome to the Cheta Shop Money Manager',
        });
    }
}
