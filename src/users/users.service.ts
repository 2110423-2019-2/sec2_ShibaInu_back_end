import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './users.dto';
import bcrypt = require('bcrypt');

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

	async getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    async getUserById(userId: number): Promise<User> {
        return this.userRepository.findOne(userId);
    }

    async getUserByUsername(username: string): Promise<User> {
        return this.userRepository.findOne({username})
    }

    async createNewUser(createUserDto: CreateUserDto) {
        const hashedPass = await bcrypt.hash(createUserDto.password, 10);
        createUserDto.password = hashedPass;

        createUserDto.createdTime = new Date();
        createUserDto.isVerified = false;
        createUserDto.isVisible = true;

        if (this.getUserByUsername(createUserDto.username)) {
            throw new BadRequestException(`This username has been used.`)
        }

        return this.userRepository.insert(createUserDto);
    }
}
