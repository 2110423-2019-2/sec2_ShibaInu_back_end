import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { FacebookStrategy } from './facebook.strategy';

@Module({
    imports: [
        UsersModule,
        PassportModule.registerAsync({
            useFactory: () => ({
                defaultStrategy: 'jwt',
            }),
        }),
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: `${process.env.JWT_SECRET}`,
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, FacebookStrategy],
})
export class AuthModule {}
