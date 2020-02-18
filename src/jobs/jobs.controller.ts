import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './jobs.dto';

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

    @Post()
    async createNewJob(@Body() createJobDto: CreateJobDto) {
        return this.jobService.createNewJob(createJobDto);
    }

    @Delete(':jobId')
    async deleteJobById(@Param('jobId') jobId: number) {
        return this.jobService.deleteJobById(jobId);
    }
}
