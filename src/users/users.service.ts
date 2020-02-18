import {
    Injectable,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, InterestedCategory, UserSkill, InterestedCategoryEnum } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, EditUserDto, UserNamePasswordDto, CreateInterestedCategoryDto, CreateSkillDto } from './users.dto';
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
        private readonly userSkillRepository: Repository<
            UserSkill
        >,
    ) {}

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find({
            select: [
                'userId',
                'fullName',
                'phone',
                'email',
                'education',
                'createdTime',
                'isVerified',
                'identificationCardPic',
                'identificationCardWithFacePic',
                'identificationNumber',
                'isVisible',
                'about',
                'location',
                'profilePicture',
                'dateOfBirth',
                'website',
                'experience',
                'resume',
                'money',
            ],
        });
    }

    async getUserById(userId: number): Promise<User> {
        return this.userRepository.findOne(userId,{
            select: [
                'userId',
                'fullName',
                'phone',
                'email',
                'education',
                'createdTime',
                'isVerified',
                'identificationCardPic',
                'identificationCardWithFacePic',
                'identificationNumber',
                'isVisible',
                'about',
                'location',
                'profilePicture',
                'dateOfBirth',
                'website',
                'experience',
                'resume',
                'money',
            ]
        });
    }

    async getUserId(userNamePasswordDto: UserNamePasswordDto) {
        console.log(userNamePasswordDto);
        return this.userRepository.find({
            where: {
                username: userNamePasswordDto.username,
                password: userNamePasswordDto.password,
            },
        });
    }

    async getMoneyById(userId: number): Promise<User> {
        return this.userRepository.findOne({
            select: ['money'],
            where: {
                userId: userId,
            },
        });
    }

    async getUserByUsername(username: string): Promise<User> {
        return this.userRepository.findOne({
            where : { username : username },
            select: [
                'userId',
                'fullName',
                'phone',
                'email',
                'education',
                'createdTime',
                'isVerified',
                'identificationCardPic',
                'identificationCardWithFacePic',
                'identificationNumber',
                'isVisible',
                'about',
                'location',
                'profilePicture',
                'dateOfBirth',
                'website',
                'experience',
                'resume',
                'money',
            ]});
    }

    async getCategoryByUserId(userId: number): Promise<InterestedCategory[]> {
        return this.interestedCategoryRepository.find({
            select: ["interestedCategory"],
            where : {
                user : userId
            }
        });
    }

    async getSkillByUserId(userId: number): Promise<UserSkill[]> {
        return this.userSkillRepository.find({
            select: ["skill"],
            where : {
                user : userId
            }
        });
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

    async createNewUserInterestedCategory(createInterestedCategoryDto: CreateInterestedCategoryDto){
        return this.interestedCategoryRepository.save(createInterestedCategoryDto);
    }

    async createNewUserSkill(createNewSkillDto: CreateSkillDto){
        return this.userSkillRepository.save(createNewSkillDto);
    }

    async editUser(editUserDto: EditUserDto) {
        return this.userRepository.save(editUserDto);
    }

    async deleteInterestedCategory(userId,interestedCategory: InterestedCategoryEnum){
        return this.interestedCategoryRepository.delete({user:userId, interestedCategory:interestedCategory});
    }

    async deleteUserSkill(userId,skill: string){
        return this.userSkillRepository.delete({user:userId, skill:skill});
    }
}
