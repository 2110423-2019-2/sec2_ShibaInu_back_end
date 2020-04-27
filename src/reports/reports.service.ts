import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report, Message } from '../entities/report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './reports.dto';
import { CreateMessageDto } from './messages.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report)
        private readonly reportRepository: Repository<Report>,

        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,

        private readonly userService: UsersService,
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

    async setReportStatus(reportId: number, status: number) {
        if (status === 0) {
            return this.reportRepository.update(reportId, { status: 'open' });
        } else {
            return this.reportRepository.update(reportId, { status: 'closed' });
        }
    }

    async sendMessage(createMessageDto: CreateMessageDto) {
        createMessageDto.createdTime = new Date();
        return this.messageRepository.save(createMessageDto);
    }

    async getMessagesByReportId(reportId: number) {
        return this.messageRepository.query(
            `select * from message where reportId = ${reportId}`,
        );
    }
}
