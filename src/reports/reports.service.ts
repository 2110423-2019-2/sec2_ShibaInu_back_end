import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report, Message } from '../entities/report.entity';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateReportDto } from './reports.dto';

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

    async getAllReports() {
        return this.reportRepository.find();
    }

    async getReportById(reportId: number) {
        return this.reportRepository.find({ where: { reportId } });
    }

    async getReportsByUserId(userId: number) {
        return this.reportRepository.find({ where: { user: userId } });
    }

    async createNewReport(createReportDto: CreateReportDto) {
        createReportDto.createdTime = new Date();
        return this.reportRepository.save(createReportDto);
    }

    async setReportStatus(reportId: number, status: number){
        if(status == 0){
            return this.reportRepository.update(reportId, { status: "open" });
        }
        else{
            return this.reportRepository.update(reportId, { status: "closed" });
        }
    }
}
