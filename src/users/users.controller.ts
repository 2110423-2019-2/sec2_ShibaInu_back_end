import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './users.dto';

@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService) {}

    @Get()
    async getAllUsers() {
		return this.userService.getAllUsers();
    }

    @Get(':id')
    async getUserById(@Param('id') id: number) {
        return this.userService.getUserById(id);
    }

    @Post()
    async createNewUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createNewUser(createUserDto);
    }
}
