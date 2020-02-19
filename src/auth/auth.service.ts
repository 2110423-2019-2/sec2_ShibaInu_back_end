import { Injectable, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt = require('bcrypt');
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string) {
        console.log(username, password);
        const user = await this.userService.getUserByUsername(username);
        console.log(user);
        if (!user) {
            throw new UnauthorizedException(`Invalid username or password`);
        }
        if (await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }

    @UseGuards(AuthGuard('local'))
    async login(user: any) {
        const payload = { sub: user.id, username: user.username };
        return { access_token: this.jwtService.sign(payload) };
    }
}
