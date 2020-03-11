import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Patch,
    UseGuards,
    Delete,
    Req,
    UseInterceptors,
    UploadedFile,
    Res,
    SetMetadata,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from 'src/util/file-uploading.utils';
import { diskStorage } from 'multer';
import { file } from '@babel/types';
import { LoadUser } from '../decorators/users.decorator';
import { AdminGuard } from '../guards/admin.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @UseGuards(AuthGuard())
    @Get('test')
    async testUserDecorator(@LoadUser() user: any, @Req() req: any) {
        console.log(user);
    }

    @Get('testnojwt')
    async testUserDecoratorNoJwt(@LoadUser() user: any) {
        console.log(user);
    }

    @Get()
    async getAllUsers() {
        return this.userService.getAllUsers();
    }

    @UseGuards(AuthGuard())
    @Get('fromtoken')
    async getUserDataFromToken(@LoadUser() user: any) {
        return this.userService.getUserById(user.id);
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
        let ret = await this.userService.getMoneyById(userId);
        return ret[0];
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

    @Get('reviewedScore/:userId')
    async getAverageReviewdScore(@Param('userId') userId: number) {
        return this.userService.getAverageReviewdScore(userId);
    }

    @Post()
    async createNewUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createNewUser(createUserDto);
    }

    @Patch('verify/:id')
    @UseGuards(AdminGuard)
    @SetMetadata('isadmin', [true])
    @UseGuards(AuthGuard())
    async verifyUser(@Param('id') userId: number) {
        return this.userService.verifyUser(userId);
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
        return this.userService.createNewUserSkill(
            userId,
            createSkillDto.skill,
        );
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

    @Post('profilePicture/:userId')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './profile_picture',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async uploadProfilePicture(
        @UploadedFile() file,
        @Param('userId') userId: number,
    ) {
        const response = {
            originalname: file.originalname,
            filename: file.filename,
        };
        return this.userService.uploadProfilePic(userId, file.filename);
    }

    @Get('profilePicture/:userId')
    async getProfilePicture(@Param('userId') userId: number, @Res() res) {
        let temp = await this.userService.getProfilePicById(userId);
        return res.sendFile(temp[0].profilePicture, {
            root: './profile_picture',
        });
    }
}
