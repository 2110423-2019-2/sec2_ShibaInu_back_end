import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report, Message } from '../entities/report.entity';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report)
        private readonly reportRepository: Repository<Report>,

        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async getAllReports(){
        return this.reportRepository.find();
    }
}
