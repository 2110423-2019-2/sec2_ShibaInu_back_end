import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    User,
    InterestedCategory,
    UserSkill,
    InterestedCategoryEnum,
} from '../entities/user.entity';
import { Repository } from 'typeorm';
import {
    CreateUserDto,
    EditUserDto,
    UserNamePasswordDto,
    CreateSkillDto,
} from './users.dto';
import bcrypt = require('bcrypt');
import { readSync } from 'fs';

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
    ) {}

    async getAllUsers(): Promise<User[]> {
        let ret = await this.userRepository.find();
        if (ret.length == 0)
            throw new BadRequestException('Not found any User');
        return ret;
    }

    async getUserById(userId: number): Promise<User> {
        let ret = await this.userRepository.findOne(userId);
        if (!ret) throw new BadRequestException('Invalid User');
        return ret;
    }

    async getUserId(userNamePasswordDto: UserNamePasswordDto) {
        let ret = await this.userRepository.find({
            where: {
                username: userNamePasswordDto.username,
                password: userNamePasswordDto.password,
            },
        });
        if (!ret || ret.length == 0)
            throw new BadRequestException('Invalid username or password');
        return ret;
    }

    async getMoneyById(userId: number): Promise<User> {
        let ret = await this.userRepository.findOne({
            select: ['money'],
            where: {
                userId: userId,
            },
        });
        if (!ret) throw new BadRequestException('Invalid UserId');
        return ret;
    }

    async getUserByUsername(username: string): Promise<User> {
        let ret = await this.userRepository.findOne();
        return ret;
    }

    async getCategoryByUserId(userId: number): Promise<InterestedCategory[]> {
        let ret = await this.interestedCategoryRepository.find({
            select: ['interestedCategory'],
            where: {
                user: userId,
            },
        });
        if (!ret) throw new BadRequestException('Invalid UserId');
        return ret;
    }

    async getSkillByUserId(userId: number): Promise<UserSkill[]> {
        let ret = await this.userSkillRepository.find({
            select: ['skill'],
            where: {
                user: userId,
            },
        });
        if (!ret) throw new BadRequestException('Invalid UserId');
        return ret;
    }

    async getAverageReviewdScore(userId: number): Promise<number> {
        let user = await this.getUserById(userId);
        return user.sumReviewedScore / user.reviewedNumber;
    }

    async createNewUser(createUserDto: CreateUserDto) {
        const hashedPass = await bcrypt.hash(createUserDto.password, 10);
        createUserDto.password = hashedPass;

        createUserDto.createdTime = new Date();
        createUserDto.isVerified = false;
        createUserDto.isVisible = true;
        createUserDto.money = 0;

        if (await this.getUserByUsername(createUserDto.username)) {
            throw new BadRequestException(`This username has been used.`);
        }

        return this.userRepository.insert(createUserDto);
    }

    async createNewUserInterestedCategory(userId, interestedCategory) {
        let ret = await this.interestedCategoryRepository.save({
            user: userId,
            interestedCategory: interestedCategory,
        });
        if (!ret) throw new BadRequestException('Invalid UserId');
        return ret;
    }

    async createNewUserSkill(userId, skill) {
        let ret = await this.userSkillRepository.save({
            user: userId,
            skill: skill,
        });
        if (!ret) throw new BadRequestException('Invalid UserId');
        return ret;
    }

    async editUser(editUserDto: EditUserDto) {
        if (editUserDto.interestedCategories) {
            let interestedCategories = editUserDto.interestedCategories;
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
            let skills = editUserDto.skills;
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
        console.log(editUserDto);
        let ret = await this.userRepository.save(editUserDto);
        if (!ret) throw new BadRequestException('Invalid UserId');
        return ret;
    }

    async updateReviewData(userId: number, score: number) {
        console.log(userId, score);
        let user = await this.getUserById(userId);
        let editUserDto = new EditUserDto();
        editUserDto.userId = userId;
        editUserDto.sumReviewedScore = user.sumReviewedScore + score;
        editUserDto.reviewedNumber = user.reviewedNumber + 1;
        return this.editUser(editUserDto);
    }

    async deleteInterestedCategoryOfUserId(userId) {
        let ret = await this.interestedCategoryRepository.delete({
            user: userId,
        });
        if (!ret) throw new BadRequestException('Invalid UserId');
        return ret;
    }

    async verifyUser(userId: number) {
        return this.userRepository.update(userId, { isVerified: true });
    }

    async deleteInterestedCategory(
        userId,
        interestedCategory: InterestedCategoryEnum,
    ) {
        let ret = await this.interestedCategoryRepository.delete({
            user: userId,
            interestedCategory: interestedCategory,
        });
        if (!ret) throw new BadRequestException('Invalid UserId');
        return ret;
    }

    async deleteUserSkillOfUserId(userId) {
        let ret = await this.userSkillRepository.delete({ user: userId });
        if (!ret) throw new BadRequestException('Invalid UserId');
        return ret;
    }

    async deleteUserSkill(userId, skill: string) {
        let ret = await this.userSkillRepository.delete({
            user: userId,
            skill: skill,
        });
        if (!ret) throw new BadRequestException('Invalid UserId');
        return ret;
    }

    async testUserDecorator(user: any) {
        console.log(user);
        return user;
    }
}
