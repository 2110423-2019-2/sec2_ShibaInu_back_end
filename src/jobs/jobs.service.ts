import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'src/entities/jobs.entity';
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

    async getJobById(id: number): Promise<Job> {
        return this.jobRepository.findOne(id);
    }

    async createNewJob(createJobDto: CreateJobDto) {
        createJobDto.createdTime = new Date();
		console.log(createJobDto);
        return this.jobRepository.insert(createJobDto);
    }

    async editJob(id: string, createJobDto: CreateJobDto) {
        createJobDto.createdTime = null;
        return this.jobRepository.update(id, createJobDto);
    }
}
