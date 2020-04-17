import { Controller, Get, Param, Body, Post } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './reports.dto';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportService: ReportsService) {}

    @Get()
    async getAllReports(){
        return this.reportService.getAllReports();
    }

    @Get(':reportId')
    async getReportById(@Param('reportId') reportId: number){
        return this.reportService.getReportById(reportId);
    }

    @Get('user/:userId')
    async getReportsByUserId(@Param('userId') userId: number){
        return this.reportService.getReportsByUserId(userId);
    }

    @Post()
    async createNewReport(@Body() createReportDto: CreateReportDto){
        return this.reportService.createNewReport(createReportDto);
    }
}
