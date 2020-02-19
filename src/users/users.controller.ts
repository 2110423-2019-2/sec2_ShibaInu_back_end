import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Patch,
    UseGuards,
    Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
    CreateUserDto,
    EditUserDto,
    UserNamePasswordDto,
    CreateInterestedCategoryDto,
    CreateSkillDto,
} from './users.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get()
    async getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Get('login')
    async getUserId(@Body() userNamePasswordDto: UserNamePasswordDto) {
        return this.userService.getUserId(userNamePasswordDto);
    }

    @Get(':userId')
    async getUserById(@Param('userId') userId: number) {
        return this.userService.getUserById(userId);
    }

    @UseGuards(AuthGuard())
    @Get('money/:userId')
    async getMoneyById(@Param('userId') userId: number) {
        return this.userService.getMoneyById(userId);
    }

    @Get('username/:username')
    async getUserByUsername(@Param('username') username: string) {
        return this.userService.getUserByUsername(username);
    }

    @Get('category/:userId')
    async getCategoryByUserId(@Param('userId') userId: number) {
        return this.userService.getCategoryByUserId(userId);
    }

    @Get('skill/:userId')
    async getSkillByUserId(@Param('userId') userId: number) {
        return this.userService.getSkillByUserId(userId);
    }

    @Post()
    async createNewUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createNewUser(createUserDto);
    }

    @Post('category/:userId')
    async createNewUserInterestedCategory(
        @Param('userId') userId: number,
        @Body() createInterestedCategoryDto: CreateInterestedCategoryDto,
    ) {
        return this.userService.createNewUserInterestedCategory(
            userId,
            createInterestedCategoryDto.interestedCategory,
        );
    }

    @Post('skill/:userId')
    async createNewUserSkill(
        @Param('userId') userId: number,
        @Body() createSkillDto: CreateSkillDto,
    ) {
        return this.userService.createNewUserSkill(userId,createSkillDto.skill);
    }

    @Patch(':userId')
    async editUser(
        @Param('userId') userId: number,
        @Body() editUserDto: EditUserDto,
    ) {
        editUserDto.userId = Number(userId);
        return this.userService.editUser(editUserDto);
    }

    @Delete('category/:userId')
    async deleteInterestedCategory(
        @Param('userId') userId: number,
        @Body() deleteInterestedCategoryDto: CreateInterestedCategoryDto,
    ) {
        return this.userService.deleteInterestedCategory(
            userId,
            deleteInterestedCategoryDto.interestedCategory,
        );
    }

    @Delete('skill/:userId')
    async deleteUserSkill(
        @Param('userId') userId: number,
        @Body() deleteUserSkillDto: CreateSkillDto,
    ) {
        return this.userService.deleteUserSkill(
            userId,
            deleteUserSkillDto.skill,
        );
    }
}
