import {
    Injectable,
    UnauthorizedException,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string) {
        const user = await this.userService.getUserByUsername(username);
        if (!user) {
            throw new UnauthorizedException(`Invalid username`);
        }
        if (user.isSNSAccount)
            throw new UnauthorizedException(
                `This account is created via third-party login providers`,
            );
        if (await bcrypt.compare(password, user.password)) {
            user.username = username;
            return user;
        }
        return null;
    }

    async login(user: any) {
        const payload = { sub: user.userId, username: user.username };
        return {
            access_token: this.jwtService.sign(payload),
            userId: user.userId,
            isAdmin: user.isAdmin,
        };
    }

    async checkBanState(userId: any) {
        const user = await this.userService.getUserById(userId);
        if (!user) throw new BadRequestException(`Invalid user ID`);
        if (user.isBanned) {
            const banreason = user.banReason;
            throw new ForbiddenException(
                `This user is banned from using our system\n Reason: ${
                    banreason ? banreason : 'Unspecified'
                }`,
            );
        }
        return user.isBanned;
    }

    async fbLogin(profile: any) {
        const user = await this.userService.handleFacebookUser(profile);
        await this.checkBanState(user.userId);
        return await this.login(user);
    }
}
