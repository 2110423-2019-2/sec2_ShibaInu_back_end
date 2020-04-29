import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Patch,
    UseGuards,
    Delete,
    UseInterceptors,
    UploadedFile,
    Res,
    SetMetadata,
    Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
    CreateUserDto,
    EditUserDto,
    UserNamePasswordDto,
    CreateInterestedCategoryDto,
    CreateSkillDto,
    VerifyApprovalDto,
    BanUserDto,
    VerifyAdminDto,
    ChangePasswordDto,
} from './users.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from '../util/file-uploading.utils';
import { diskStorage } from 'multer';
import { LoadUser } from '../decorators/users.decorator';
import { AdminGuard } from '../guards/admin.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @UseGuards(AuthGuard())
    @Get('test')
    async testUserDecorator(@LoadUser() user: any) {
        console.log(user);
    }

    @Get('testnojwt')
    async testUserDecoratorNoJwt(@LoadUser() user: any) {
        console.log(user);
    }

    @Get()
    async getAllUsers(
        @Query('name') name: string,
        @Query('cat') cat: string,
        @Query('s1') skill1: string,
        @Query('s2') skill2: string,
        @Query('s3') skill3: string,
        @Query('sort') sort: number,
    ) {
        return this.userService.getAllUsers(
            name,
            cat,
            skill1,
            skill2,
            skill3,
            sort,
        );
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

    @Get('verify')
    @UseGuards(AdminGuard)
    @SetMetadata('isadmin', [true])
    @UseGuards(AuthGuard())
    async getAllPendingVerificationRequest() {
        return this.userService.getAllPendingVerificationRequest();
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

    @Get('reviewedScore/:userId')
    async getAverageReviewdScore(@Param('userId') userId: number) {
        return this.userService.getAverageReviewdScore(userId);
    }

    @Post()
    async createNewUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createNewUser(createUserDto);
    }

    @UseGuards(AuthGuard())
    @Patch('change-password')
    async changePassword(
        @LoadUser() user: any,
        @Body() changePasswordDto: ChangePasswordDto,
    ) {
        return this.userService.changePassword(user.id, changePasswordDto);
    }

    @UseGuards(AuthGuard())
    @Post('verify/request')
    async requestVerification(@LoadUser() user: any) {
        return this.userService.requestVerification(user.id);
    }

    @Patch('verify/verify')
    @UseGuards(AdminGuard)
    @SetMetadata('isadmin', [true])
    @UseGuards(AuthGuard())
    async verifyUser(@Body() verifyApprovalDto: VerifyApprovalDto) {
        return this.userService.verifyUser(verifyApprovalDto);
    }

    @Patch('ban')
    @UseGuards(AdminGuard)
    @SetMetadata('isadmin', [true])
    @UseGuards(AuthGuard())
    async banUser(@Body() banUserDto: BanUserDto) {
        return this.userService.banUser(banUserDto);
    }

    @Patch('verify/admin')
    @UseGuards(AdminGuard)
    @SetMetadata('isadmin', [true])
    @UseGuards(AuthGuard())
    async verifyAdmin(@Body() verifyAdminDto: VerifyAdminDto) {
        return this.userService.verifyAdmin(verifyAdminDto);
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
        return this.userService.uploadProfilePic(userId, file.filename);
    }

    @Get('profilePicture/:userId')
    async getProfilePicture(@Param('userId') userId: number, @Res() res) {
        const temp = await this.userService.getProfilePicById(userId);
        return res.sendFile(temp[0].profilePicture, {
            root: './profile_picture',
        });
    }

    @Post('IDCard/:userId')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './idcard',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async uploadIDCard(@UploadedFile() file, @Param('userId') userId: number) {
        return this.userService.uploadIDCard(userId, file.filename);
    }

    @Get('IDCard/:userId')
    async getIDCard(@Param('userId') userId: number, @Res() res) {
        const temp = await this.userService.getIDCardById(userId);
        return res.sendFile(temp[0].identificationCardPic, {
            root: './idcard',
        });
    }

    @Post('IDCardWithFace/:userId')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './idcard_with_face',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async uploadIDCardWithFace(
        @UploadedFile() file,
        @Param('userId') userId: number,
    ) {
        return this.userService.uploadIDCardWithFace(userId, file.filename);
    }

    @Get('IDCardWithFace/:userId')
    async getIDCardWithFace(@Param('userId') userId: number, @Res() res) {
        const temp = await this.userService.getIDCardWithFaceById(userId);
        return res.sendFile(temp[0].identificationCardWithFacePic, {
            root: './idcard_with_face',
        });
    }
}
