import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, EditUserDto, UserNamePasswordDto } from './users.dto';
import bcrypt = require('bcrypt');

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find({
            select: [
                'userId',
                'firstName',
                'lastName',
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
                'skills',
                'money',
                'interestedCategories',
            ],
        });
    }

    async getUserById(userId: number): Promise<User> {
        return this.userRepository.findOne(userId);
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

    async getInterestedCategoriesById(userId: number): Promise<User> {
        return this.userRepository.findOne({
            select: ['interestedCategories'],
            where: {
                userId: userId,
            },
        });
    }

    async getUserByUsername(username: string): Promise<User> {
        return this.userRepository.findOne({ username });
    }

    async createNewUser(createUserDto: CreateUserDto) {
        const hashedPass = await bcrypt.hash(createUserDto.password, 10);
        createUserDto.password = hashedPass;

        createUserDto.createdTime = new Date();
        createUserDto.isVerified = false;
        createUserDto.isVisible = true;
        createUserDto.money = 0;

        if (this.getUserByUsername(createUserDto.username)) {
            throw new BadRequestException(`This username has been used.`);
        }

        return this.userRepository.insert(createUserDto);
    }

    async editUser(editUserDto: EditUserDto) {
        return this.userRepository.save(editUserDto);
    }
}
