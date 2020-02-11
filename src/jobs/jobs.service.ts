import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'src/entities/job.entity';
import { Repository } from 'typeorm';
import { CreateJobDto } from './jobs.dto';

@Injectable()
export class JobsService {
    constructor(
        @InjectRepository(Job)
        private readonly jobRepository: Repository<Job>,
    ) {}

    async getAllJobs(): Promise<Job[]> {
        return this.jobRepository.find();
    }

    async getJobById(jobId: number): Promise<Job> {
        return this.jobRepository.findOne(jobId);
    }

    async createNewJob(createJobDto: CreateJobDto) {
        createJobDto.createdTime = new Date();
        return this.jobRepository.insert(createJobDto);
    }

    async editJob(jobId: number, createJobDto: CreateJobDto) {
        createJobDto.createdTime = null;
        return this.jobRepository.update(jobId, createJobDto);
    }
}
