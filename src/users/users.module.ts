import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    User,
    InterestedCategory,
    UserSkill,
    VerifyRequest,
} from '../entities/user.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            InterestedCategory,
            UserSkill,
            VerifyRequest,
        ]),
        PassportModule.registerAsync({
            useFactory: () => ({
                defaultStrategy: 'jwt',
            }),
        }),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
