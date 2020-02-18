import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, InterestedCategory } from '../entities/user.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
	imports: [TypeOrmModule.forFeature([User, InterestedCategory]),PassportModule.register({ defaultStrategy: 'jwt' })],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
