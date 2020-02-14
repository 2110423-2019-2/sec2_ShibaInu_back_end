import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, EditUserDto, UserNamePasswordDto } from './users.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

	async getAllUsers(): Promise<User[]> {
        return this.userRepository.find({
            select: ["userId",
            "firstName",
            "lastName",
            "phone",
            "email",
            "education",
            "createdTime",
            "isVerified",
            "identificationCardPic",
            "identificationCardWithFacePic",
            "identificationNumber",
            "isVisible",
            "about",
            "location",
            "profilePicture",
            "dateOfBirth",
            "website",
            "experience",
            "resume",
            "skills",
            "money"] 
        });
    }

    async getUserById(userId: number): Promise<User> {
        let user = this.userRepository.findOne(userId);
        return this.userRepository.findOne(userId);
    }

    async getUserId(userNamePasswordDto: UserNamePasswordDto) {
        return this.userRepository.find({
            where:  {
                username : userNamePasswordDto.username,
                password : userNamePasswordDto.password
            }
        });
    }

    async getMoneyById(userId: number): Promise<User> {
        return this.userRepository.findOne({
            select: ["money"],
            where:  {
                userId : userId
            }
        });
    }

    async createNewUser(createUserDto: CreateUserDto) {
        createUserDto.createdTime = new Date();
        createUserDto.isVerified = false;
        createUserDto.isVisible = true;
        createUserDto.money = 0;
        return this.userRepository.insert(createUserDto);
    }

    async editUser(editUserDto: EditUserDto) {
        return this.userRepository.save(editUserDto);
    }

    
}
