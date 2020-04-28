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
import { LoadUser } from '../decorators/users.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
    constructor(private readonly jobService: JobsService) {}

    @Get()
    async getAllJobs(
        @Query('name') name: string,
        @Query('w1') w1: number,
        @Query('w2') w2: number,
        @Query('t1') t1: number,
        @Query('t2') t2: number,
        @Query('cat') cat: string,
        @Query('rs1') rs1: string,
        @Query('rs2') rs2: string,
        @Query('rs3') rs3: string,
        @Query('os1') os1: string,
        @Query('os2') os2: string,
        @Query('os3') os3: string,
        @Query('sort') sort: number,
        @Query('status') status: string,
    ) {
        return this.jobService.getAllJobs(
            name,
            w1,
            w2,
            t1,
            t2,
            cat,
            rs1,
            rs2,
            rs3,
            os1,
            os2,
            os3,
            sort,
            status,
        );
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

    @Patch('finishJob')
    async finishJobByJobId(@Body() updateJobDto: UpdateJobDto) {
        return this.jobService.finishJob(updateJobDto);
    }

    @Get('finishedLink/:jobId')
    async getJobLinkByJobId(@Param('jobId') jobId: number) {
        return this.jobService.getJobLinkByJobId(jobId);
    }

    @UseGuards(AuthGuard())
    @Patch('confirm/:jobId,:boolean')
    async confirmJob(
        @LoadUser() user: any,
        @Param('jobId') jobId: number,
        @Param('boolean') boolean: number,
    ) {
        return this.jobService.confirmJob(jobId, boolean, user.id);
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

    @UseGuards(AuthGuard())
    @Patch(':jobId')
    async editJob(
        @LoadUser() user: any,
        @Param('jobId') jobId: number,
        @Body() updateJobDto: UpdateJobDto,
    ) {
        return this.jobService.editJob(jobId, user.id, updateJobDto);
    }

    @Get('freelancers/:jobId')
    async getInterestedFreelancersById(@Param('jobId') jobId: number) {
        return this.jobService.getInterestedFreelancersById(jobId);
    }
}
