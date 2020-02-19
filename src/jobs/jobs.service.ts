import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from '../entities/job.entity';
import { Repository } from 'typeorm';
import { CreateJobDto, UpdateJobDto } from './jobs.dto';
import { NamingStrategyMetadataArgs } from 'typeorm/metadata-args/NamingStrategyMetadataArgs';

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

    async getJobByUserId(userId: number): Promise<Job[]>{
        return this.jobRepository.find({
            where: {client: userId}
        });
    }

    async createNewJob(createJobDto: CreateJobDto) {
        createJobDto.createdTime = new Date();
        return this.jobRepository.save(createJobDto);
    }

    async editJob(jobId: number, updateJobDto: UpdateJobDto) {
        if (updateJobDto.requiredSkills) {
            let updateJobReqSkills = updateJobDto.requiredSkills;
            //console.log(updateJobDto.requiredSkills);
            //console.log(`DELETE FROM job_req_skill WHERE jobId = ${jobId}`);
            await this.jobRepository.query(
                `DELETE FROM job_req_skill WHERE jobId = ${jobId}`,
            );
            //console.log(updateJobReqSkills);
            for (let i = 0; i < updateJobReqSkills.length; i++) {
                //console.log(updateJobReqSkills[i]);
                //console.log(`INSERT INTO job_req_skill VALUES ("${updateJobReqSkills[i].skill}",${jobId})`);
                this.jobRepository.query(
                    `INSERT INTO job_req_skill VALUES ("${updateJobReqSkills[i].skill}",${jobId})`,
                );
            }
            delete updateJobDto.requiredSkills;
        }
        if (updateJobDto.optionalSkills) {
            let updateJobOptSkills = updateJobDto.optionalSkills;
            //console.log(updateJobOptSkill);
            //console.log(`DELETE FROM job_opt_skill WHERE jobId = ${jobId}`);
            await this.jobRepository.query(
                `DELETE FROM job_opt_skill WHERE jobId = ${jobId}`,
            );
            for (let i = 0; i < updateJobOptSkills.length; i++) {
                //console.log(`INSERT INTO job_opt_skill VALUES (${updateJobOptSkills[i].skill},${jobId})`);
                this.jobRepository.query(
                    `INSERT INTO job_opt_skill VALUES ("${updateJobOptSkills[i].skill}",${jobId})`,
                );
            }
            delete updateJobDto.optionalSkills;
        }
        //console.log(updateJobDto);
        return this.jobRepository.update(jobId, updateJobDto);
    }

    async deleteJobById(jobId: number) {
        return this.jobRepository.delete(jobId);
    }
}
