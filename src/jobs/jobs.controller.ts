import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Delete,
    Patch,
    UseGuards,
    Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto } from './jobs.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('jobs')
export class JobsController {
    constructor(private readonly jobService: JobsService) {}

    @Get()
    async getAllJobs(@Query('name') name: string,@Query('w1') w1: number,@Query('w2') w2: number,
    @Query('t1') t1: number,
    @Query('t2') t2: number,
    @Query('cat') cat: string,
    @Query('rs1') rs1: string,
    @Query('rs2') rs2: string,
    @Query('rs3') rs3: string,
    @Query('os1') os1: string,
    @Query('os2') os2: string,
    @Query('os3') os3: string,) {
        return this.jobService.getAllJobs(name,w1,w2,t1,t2,cat,rs1,rs2,rs3,os1,os2,os3);
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

    @Get('recommend/:userId')
    async getRecommendJobByFreelancerId(@Param('userId') userId: number) {
        return this.jobService.getRecommendJobByFreelancerId(userId);
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
