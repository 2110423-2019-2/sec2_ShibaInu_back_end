import {
    Injectable,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    User,
    InterestedCategory,
    UserSkill,
    InterestedCategoryEnum,
    VerifyRequest,
} from '../entities/user.entity';
import { Repository, getRepository, Like } from 'typeorm';
import {
    CreateUserDto,
    EditUserDto,
    UserNamePasswordDto,
    VerifyApprovalDto,
    BanUserDto,
    VerifyAdminDto,
    ChangePasswordDto,
} from './users.dto';
import bcrypt = require('bcrypt');

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(InterestedCategory)
        private readonly interestedCategoryRepository: Repository<
            InterestedCategory
        >,

        @InjectRepository(UserSkill)
        private readonly userSkillRepository: Repository<UserSkill>,

        @InjectRepository(VerifyRequest)
        private readonly verifyRequestRepository: Repository<VerifyRequest>,
    ) {}

    async getAllUsers(
        name: string,
        cat: string,
        skill1: string,
        skill2: string,
        skill3: string,
        sort: number,
    ): Promise<User[]> {
        if (!name) name = '';
        const usersFromFirstName = await this.userRepository.find({
            select: ['userId'],
            where: {
                firstName: Like(`%${name}%`),
            },
        });
        const usersFromLastName = await this.userRepository.find({
            select: ['userId'],
            where: {
                lastName: Like(`%${name}%`),
            },
        });
        let data = [[]];
        for (let i = 0; i < usersFromFirstName.length; i++)
            data[0].push(usersFromFirstName[i].userId);
        for (let i = 0; i < usersFromLastName.length; i++)
            data[0].push(usersFromLastName[i].userId);
        if (cat) {
            const usersFromCategory = await this.interestedCategoryRepository.find(
                { where: { interestedCategory: cat } },
            );
            data.push([]);
            for (let i = 0; i < usersFromCategory.length; i++)
                data[data.length - 1].push(usersFromCategory[i].userId);
        }
        if (skill1) {
            const usersFromSkill1 = await this.userSkillRepository.find({
                where: { skill: skill1 },
            });
            data.push([]);
            for (let i = 0; i < usersFromSkill1.length; i++)
                data[data.length - 1].push(usersFromSkill1[i].userId);
        }
        if (skill2) {
            const usersFromSkill2 = await this.userSkillRepository.find({
                where: { skill: skill2 },
            });
            data.push([]);
            for (let i = 0; i < usersFromSkill2.length; i++)
                data[data.length - 1].push(usersFromSkill2[i].userId);
        }
        if (skill3) {
            const usersFromSkill3 = await this.userSkillRepository.find({
                where: { skill: skill3 },
            });
            data.push([]);
            for (let i = 0; i < usersFromSkill3.length; i++)
                data[data.length - 1].push(usersFromSkill3[i].userId);
        }
        const userIds = data.reduce((a, b) => a.filter(c => b.includes(c)));
        let sortingMethod: Object;
        switch (Number(sort)) {
            case 0:
                sortingMethod = { userId: 'DESC' };
                break;
            case 1:
                sortingMethod = { userId: 'ASC' };
                break;
            case 2:
                sortingMethod = { sumReviewedScore: 'DESC' };
                break;
            case 3:
                sortingMethod = { sumReviewedScore: 'ASC' };
                break;
            default:
                sortingMethod = { sumReviewedScore: 'DESC' };
                break;
        }
        const ret = await this.userRepository.findByIds(userIds, {
            order: sortingMethod,
        });
        if (ret.length === 0)
            throw new BadRequestException('Not found any User');
        return ret;
    }

    async getUserById(userId: number): Promise<User> {
        const ret = await this.userRepository.findOne(userId);
        if (!ret) throw new BadRequestException('Invalid User');
        return ret;
    }

    async getUserId(userNamePasswordDto: UserNamePasswordDto) {
        const ret = await this.userRepository.find({
            where: {
                username: userNamePasswordDto.username,
                password: userNamePasswordDto.password,
            },
        });
        if (!ret || ret.length === 0)
            throw new BadRequestException('Invalid username or password');
        return ret;
    }

    async getMoneyById(userId: number): Promise<User> {
        let ret = await this.userRepository.findOne({
            select: ['userId', 'money'],
            where: {
                userId: userId,
            },
        });
        if (!ret) throw new BadRequestException('Invalid UserId');
        delete ret.userId;
        return ret;
    }

    async getUserByUsername(username: string): Promise<User> {
        const ret = await this.userRepository.findOne({
            where: {
                username: username,
            },
        });
        return ret;
    }

    // Currently unusable, use func. above with the entity allowed to get username/password instead.
    async getUserPassword(username: string): Promise<User> {
        const ret = await getRepository(User)
            .createQueryBuilder('user')
            .select(['username', 'password'])
            .where('username = :username', { username })
            .getOne();
        console.log(username);
        if (!ret) throw new BadRequestException('Invalid Username');
        return ret;
    }

    async getCategoryByUserId(userId: number): Promise<InterestedCategory[]> {
        const ret = await this.interestedCategoryRepository.find({
            select: ['interestedCategory'],
            where: {
                userId: userId,
            },
        });
        if (!ret) throw new BadRequestException('Invalid UserId');
        return ret;
    }

    async getSkillByUserId(userId: number): Promise<UserSkill[]> {
        const ret = await this.userSkillRepository.find({
            select: ['skill'],
            where: {
                userId: userId,
            },
        });
        if (!ret) throw new BadRequestException('Invalid UserId');
        return ret;
    }

    async getAverageReviewdScore(userId: number): Promise<number> {
        const user = await this.getUserById(userId);
        return user.sumReviewedScore / user.reviewedNumber;
    }

    async handleFacebookUser(profile: any) {
        const user = await this.userRepository.findOne({
            username: `fb${profile.id}`,
        });
        if (user) return user;

        let firstName: string;
        if (profile.name.middleName.length > 0) {
            firstName = `${profile.name.givenName} ${profile.name.middleName}`;
        } else {
            firstName = profile.name.givenName;
        }

        await this.createNewUser({
            firstName: firstName,
            lastName: profile.name.familyName,
            username: `fb${profile.id}`,
            password: `passwordunused`,
            email: profile.emails[0].value,
            profilePicture: profile.photos[0].value,
            isSNSAccount: true,
        });

        return await this.userRepository.findOne({
            username: `fb${profile.id}`,
        });
    }

    async createNewUser(createUserDto: CreateUserDto) {
        const hashedPass = await bcrypt.hash(createUserDto.password, 10);
        createUserDto.password = hashedPass;

        createUserDto.createdTime = new Date();
        createUserDto.isVerified = false;
        createUserDto.isVisible = true;
        createUserDto.money = 0;
        createUserDto.sumReviewedScore = 0;
        createUserDto.reviewedNumber = 0;
        createUserDto.isBanned = false;

        if (await this.getUserByUsername(createUserDto.username)) {
            throw new BadRequestException(`This username has been used.`);
        }

        return this.userRepository.insert(createUserDto);
    }

    async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
        if ((await this.getUserById(userId)).isSNSAccount) {
            throw new ForbiddenException(
                `SNS account don't have password, and thus can't change password.`,
            );
        }
        if (
            await bcrypt.compare(
                changePasswordDto.oldpassword,
                (await this.getUserById(userId)).password,
            )
        ) {
            const hashedPass = await bcrypt.hash(
                changePasswordDto.newpassword,
                10,
            );
            return this.userRepository.update(
                { userId },
                { password: hashedPass },
            );
        } else {
            throw new BadRequestException(`Old password is incorrect`);
        }
    }

    async createNewUserInterestedCategory(userId, interestedCategory) {
        const ret = await this.interestedCategoryRepository.insert({
            userId: userId,
            interestedCategory: interestedCategory,
        });
        if (!ret) throw new BadRequestException('Invalid UserId');
        return ret;
    }

    async createNewUserSkill(userId, skill) {
        const ret = await this.userSkillRepository.insert({
            userId: userId,
            skill: skill,
        });
        if (!ret) throw new BadRequestException('Invalid UserId');
        return ret;
    }

    async editUser(editUserDto: EditUserDto) {
        if (editUserDto.interestedCategories) {
            const interestedCategories = editUserDto.interestedCategories;
            delete editUserDto.interestedCategories;

            this.deleteInterestedCategoryOfUserId(editUserDto.userId); //delete

            for (let i = 0; i < interestedCategories.length; i++) {
                //insert
                await this.createNewUserInterestedCategory(
                    editUserDto.userId,
                    interestedCategories[i].interestedCategory,
                );
            }
        }
        if (editUserDto.skills) {
            const skills = editUserDto.skills;
            delete editUserDto.skills;

            this.deleteUserSkillOfUserId(editUserDto.userId); //delete

            for (let i = 0; i < skills.length; i++) {
                //insert
                await this.createNewUserSkill(
                    editUserDto.userId,
                    skills[i].skill,
                );
            }
        }
        const ret = await this.userRepository.save(editUserDto);
        if (!ret) throw new BadRequestException('Invalid UserId');
        return ret;
    }

    async updateReviewData(userId: number, score: any) {
        const user = await this.getUserById(userId);
        score = parseInt(score);
        const editUserDto: EditUserDto = {
            userId: userId,
            sumReviewedScore: user.sumReviewedScore + score,
            reviewedNumber: user.reviewedNumber + 1,
        };
        return this.editUser(editUserDto);
    }

    async deleteInterestedCategoryOfUserId(userId) {
        const ret = await this.interestedCategoryRepository.delete({
            userId: userId,
        });
        if (!ret) throw new BadRequestException('Invalid UserId');
        return ret;
    }

    async requestVerification(userId: number) {
        const requestedUser = await this.getUserById(userId);
        if (requestedUser.isVerified) {
            throw new BadRequestException(
                `This user have already been verified!`,
            );
        }
        if (await this.verifyRequestRepository.findOne({ requestedUser })) {
            throw new BadRequestException(
                `This user already requested verification and is waiting for admin approval`,
            );
        }
        return this.verifyRequestRepository.insert({
            requestedUser,
        });
    }

    async verifyUser(verifyApprovalDto: VerifyApprovalDto): Promise<any> {
        let res: any = null;
        if (verifyApprovalDto.approve) {
            res = await this.userRepository.update(verifyApprovalDto.user, {
                isVerified: true,
            });
        }
        await this.verifyRequestRepository.delete({
            requestedUser: verifyApprovalDto.user,
        });
        return res;
    }

    async banUser(banUser: BanUserDto): Promise<any> {
        let res: any = null;
        if ((await this.userRepository.findOne(banUser.user)).isAdmin === true)
            throw new ForbiddenException('Admin ban is prohibited');
        res = await this.userRepository.update(banUser.user, {
            isBanned: banUser.isBanned,
            banReason: banUser.banReason,
        });
        if (res.raw.affectedRows === 0)
            throw new BadRequestException('Invalid UserId');
        return res;
    }

    async verifyAdmin(verifyAdminDto: VerifyAdminDto): Promise<any> {
        let res: any = null;
        res = await this.userRepository.update(verifyAdminDto.user, {
            isAdmin: verifyAdminDto.isAdmin,
        });
        if (res.raw.affectedRows === 0)
            throw new BadRequestException('Invalid UserId');
        return res;
    }

    async getAllPendingVerificationRequest(): Promise<VerifyRequest[]> {
        return this.verifyRequestRepository.find();
    }

    async deleteInterestedCategory(
        userId,
        interestedCategory: InterestedCategoryEnum,
    ) {
        const ret = await this.interestedCategoryRepository.delete({
            userId: userId,
            interestedCategory: interestedCategory,
        });
        if (!ret) throw new BadRequestException('Invalid UserId');
        return ret;
    }

    async deleteUserSkillOfUserId(userId) {
        const ret = await this.userSkillRepository.delete({ userId: userId });
        if (!ret) throw new BadRequestException('Invalid UserId');
        return ret;
    }

    async deleteUserSkill(userId, skill: string) {
        const ret = await this.userSkillRepository.delete({
            userId: userId,
            skill: skill,
        });
        if (!ret) throw new BadRequestException('Invalid UserId');
        return ret;
    }

    async testUserDecorator(user: any) {
        console.log(user);
        return user;
    }

    async uploadProfilePic(userId, filename: string) {
        return this.userRepository.update(userId, { profilePicture: filename });
    }

    async getProfilePicById(userId: number): Promise<User[]> {
        const ret = await this.userRepository.find({
            select: ['profilePicture'],
            where: {
                userId: userId,
            },
        });
        if (!ret) throw new BadRequestException('Invalid UserId');
        return ret;
    }

    async uploadIDCard(userId, filename: string) {
        return this.userRepository.update(userId, {
            identificationCardPic: filename,
        });
    }

    async getIDCardById(userId: number): Promise<User[]> {
        const ret = await this.userRepository.find({
            select: ['identificationCardPic'],
            where: {
                userId: userId,
            },
        });
        if (!ret) throw new BadRequestException('Invalid UserId');
        return ret;
    }

    async uploadIDCardWithFace(userId, filename: string) {
        return this.userRepository.update(userId, {
            identificationCardWithFacePic: filename,
        });
    }

    async getIDCardWithFaceById(userId: number): Promise<User[]> {
        const ret = await this.userRepository.find({
            select: ['identificationCardWithFacePic'],
            where: {
                userId: userId,
            },
        });
        if (!ret) throw new BadRequestException('Invalid UserId');
        return ret;
    }
}
