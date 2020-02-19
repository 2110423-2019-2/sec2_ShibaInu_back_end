import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Delete,
    Patch,
    UseGuards,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto } from './jobs.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('jobs')
export class JobsController {
    constructor(private readonly jobService: JobsService) {}

    @Get()
    async getAllJobs() {
        return this.jobService.getAllJobs();
    }

    @Get(':jobId')
    async getJobById(@Param('jobId') jobId: number) {
        return this.jobService.getJobById(jobId);
    }

    @Get('user/:userId')
    async getJobByUserId(@Param('userId') userId: number) {
        return this.jobService.getJobByUserId(userId);
    }

    @Get('recent/:userId')
    async getRecentJobByClientId(@Param('userId') userId: number) {
        return this.jobService.getRecentJobByClientId(userId);
    }

    @UseGuards(AuthGuard())
    @Post()
    async createNewJob(@Body() createJobDto: CreateJobDto) {
        return this.jobService.createNewJob(createJobDto);
    }

    @Delete(':jobId')
    async deleteJobById(@Param('jobId') jobId: number) {
        return this.jobService.deleteJobById(jobId);
    }

    @Patch(':jobId')
    async editJob(
        @Param('jobId') jobId: number,
        @Body() updateJobDto: UpdateJobDto,
    ) {
        return this.jobService.editJob(jobId, updateJobDto);
    }
}
