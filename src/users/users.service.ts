import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './users.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

	async getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    async getUserById(id: number): Promise<User> {
        return this.userRepository.findOne(id);
    }

    async createNewUser(createUserDto: CreateUserDto) {
        createUserDto.createdTime = new Date();

        var regName = /^[a-z]{2,50}$/;
        createUserDto.name = createUserDto.name.toLowerCase();
        createUserDto.surname = createUserDto.surname.toLowerCase();
        if(!regName.test(createUserDto.name) || !regName.test(createUserDto.surname)) return null;
        
        var regPhone = /^[0-9]{10}$/;
        if(!regPhone.test(createUserDto.phone)) return null;
        
        var regUsername = /^[a-zA-Z][\dA-Za-z]{5,50}$/;
        var regPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if(!regUsername.test(createUserDto.username) || !regPassword.test(createUserDto.password)) return null;

        var regEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/;
        if(!regEmail.test(createUserDto.email)) return null;
        
        return this.userRepository.insert(createUserDto);
    }
}
