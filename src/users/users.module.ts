import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, InterestedCategory } from '../entities/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User]),TypeOrmModule.forFeature([InterestedCategory])],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
