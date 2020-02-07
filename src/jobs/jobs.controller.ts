import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './jobs.dto';

@Controller('jobs')
export class JobsController {
    constructor(private readonly jobService: JobsService) {}

    @Get()
    async getAllJobs() {
        return this.jobService.getAllJobs();
    }

    @Get(':id')
    async getJobById(@Param('id') id: number) {
        return this.jobService.getJobById(id);
    }

    @Post()
    async createNewJob(@Body() createJobDto: CreateJobDto) {
        return this.jobService.createNewJob(createJobDto);
    }
}
