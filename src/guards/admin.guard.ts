import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly userService: UsersService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isAdmin = this.reflector.get<boolean[]>(
            'isadmin',
            context.getHandler(),
        );
        if (!isAdmin) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const userEntity = await this.userService.getUserById(user.id);
        if (!userEntity.isAdmin) {
            throw new ForbiddenException(`This feature is for admin only!`);
        }
        return userEntity.isAdmin;
    }
}
