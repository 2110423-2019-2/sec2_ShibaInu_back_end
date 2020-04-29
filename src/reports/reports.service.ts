import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report, Message, ReportStatusEnum } from '../entities/report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './reports.dto';
import { CreateMessageDto } from './messages.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report)
        private readonly reportRepository: Repository<Report>,

        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
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
        if (Number(status) === 0) {
            return this.reportRepository.update(reportId, {
                status: ReportStatusEnum.OPEN,
            });
        } else {
            return this.reportRepository.update(reportId, {
                status: ReportStatusEnum.CLOSED,
            });
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
