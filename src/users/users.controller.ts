import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, EditUserDto } from './users.dto';

@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService) {}

    @Get()
    async getAllUsers() {
		return this.userService.getAllUsers();
    }

    @Get(':userId')
    async getUserById(@Param('userId') userId: number) {
        return this.userService.getUserById(userId);
    }

    @Post()
    async createNewUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createNewUser(createUserDto);
    }

    @Patch()
    async editUser(@Body() editUserDto: EditUserDto) {
        return this.userService.editUser(editUserDto);
    }
}
