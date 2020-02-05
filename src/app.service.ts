import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }

    async getPing(): Promise<string> {
        return 'Pong';
    }
}
