import {
    Controller,
    Get,
    Param,
    Body,
    Post,
    Patch,
    UseGuards,
    SetMetadata,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './reports.dto';
import { CreateMessageDto } from './messages.dto';
import { AdminGuard } from '../guards/admin.guard';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
    constructor(private readonly reportService: ReportsService) {}

    @Get()
    @UseGuards(AdminGuard)
    @SetMetadata('isadmin', [true])
    @UseGuards(AuthGuard())
    async getAllReports() {
        return this.reportService.getAllReports();
    }

    @Get(':reportId')
    async getReportById(@Param('reportId') reportId: number) {
        return this.reportService.getReportById(reportId);
    }

    @Get('user/:userId')
    async getReportsByUserId(@Param('userId') userId: number) {
        return this.reportService.getReportsByUserId(userId);
    }

    @Get('messages/:reportId')
    async getMessagesByReportId(@Param('reportId') reportId: number) {
        return this.reportService.getMessagesByReportId(reportId);
    }

    @Post()
    async createNewReport(@Body() createReportDto: CreateReportDto) {
        return this.reportService.createNewReport(createReportDto);
    }

    @Patch(':reportId/:status')
    @UseGuards(AdminGuard)
    @SetMetadata('isadmin', [true])
    @UseGuards(AuthGuard())
    async setReportStatus(
        @Param('reportId') reportId: number,
        @Param('status') status: number,
    ) {
        return this.reportService.setReportStatus(reportId, status);
    }

    @Post('send')
    async sendMessage(@Body() createMessageDto: CreateMessageDto) {
        return this.reportService.sendMessage(createMessageDto);
    }
}
