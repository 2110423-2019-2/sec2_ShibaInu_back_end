import {
    Controller,
    Post,
    UseGuards,
    Request,
    Param,
    Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req: any) {
        return this.authService.login(req.user);
    }

    @UseGuards(AuthGuard('facebook-token'))
    @Post('login-fb')
    async fbLogin(@Request() req: any) {
        return this.authService.fbLogin(req.user);
    }

    @Get('checkban/:username')
    async checkBanState(@Param('username') username: string) {
        return this.authService.checkBanState(username);
    }
}
