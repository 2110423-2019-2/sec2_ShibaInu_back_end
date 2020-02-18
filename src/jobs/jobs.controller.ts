import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './jobs.dto';
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

    @UseGuards(AuthGuard())
    @Post()
    async createNewJob(@Body() createJobDto: CreateJobDto) {
        return this.jobService.createNewJob(createJobDto);
    }
}
