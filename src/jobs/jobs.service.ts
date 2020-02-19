import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InterestedCategory } from '../entities/user.entity';
import { Job, JobReqSkill, JobOptSkill } from '../entities/job.entity';
import { Repository } from 'typeorm';
import { CreateJobDto, UpdateJobDto } from './jobs.dto';
import { NamingStrategyMetadataArgs } from 'typeorm/metadata-args/NamingStrategyMetadataArgs';

@Injectable()
export class JobsService {
    constructor(
        @InjectRepository(Job)
        private readonly jobRepository: Repository<Job>,

        @InjectRepository(InterestedCategory)
        private readonly interestedCategoryRepository: Repository<
            InterestedCategory
        >,

        @InjectRepository(JobReqSkill)
        private readonly jobReqSkillRepository: Repository<JobReqSkill>,

        @InjectRepository(JobOptSkill)
        private readonly jobOptSkillRepository: Repository<JobReqSkill>,
    ) {}

    async getAllJobs(): Promise<Job[]> {
        return this.jobRepository.find();
    }

    async getJobById(jobId: number): Promise<Job> {
        return this.jobRepository.findOne(jobId);
    }

    async getJobByUserId(userId: number): Promise<Job[]> {
        return this.jobRepository.find({
            where: { client: userId },
        });
    }

    async createNewJob(createJobDto: CreateJobDto) {
        createJobDto.createdTime = new Date();
        createJobDto.updatedTime = new Date();
        return this.jobRepository.save(createJobDto);
    }

    async editJob(jobId: number, updateJobDto: UpdateJobDto) {
        if (updateJobDto.requiredSkills) {
            let updateJobReqSkills = updateJobDto.requiredSkills;
            await this.jobReqSkillRepository.delete({ job: { jobId: jobId } });
            for (let i = 0; i < updateJobReqSkills.length; i++) {
                this.jobReqSkillRepository.insert({
                    skill: updateJobReqSkills[i].skill,
                    job: { jobId: jobId },
                });
            }
            delete updateJobDto.requiredSkills;
        }
        if (updateJobDto.optionalSkills) {
            let updateJobOptSkills = updateJobDto.optionalSkills;
            await this.jobOptSkillRepository.delete({ job: { jobId: jobId } });
            for (let i = 0; i < updateJobOptSkills.length; i++) {
                this.jobOptSkillRepository.insert({
                    skill: updateJobOptSkills[i].skill,
                    job: { jobId: jobId },
                });
            }
            delete updateJobDto.optionalSkills;
        }
        updateJobDto.updatedTime = new Date();
        return this.jobRepository.update(jobId, updateJobDto);
    }

    async deleteJobById(jobId: number) {
        return this.jobRepository.delete(jobId);
    }

    async getRecentJobByClientId(clientUserId: number) {
        return this.jobRepository.find({
            where: { client: clientUserId },
            order: { updatedTime: 'DESC' },
            take: 5,
        });
    }

    async getRecommendJobByFreelancerId(
        freelancerUserId: number,
    ): Promise<Job[]> {
        let temp = await this.interestedCategoryRepository.find({
            where: { user: freelancerUserId },
        });
        let tempArray = [];
        for (let i = 0; i < temp.length; i++) {
            tempArray.push({
                catergory: temp[i].interestedCategory,
            });
        }
        return getRandom(
            await this.jobRepository.find({
                where: tempArray,
            }),
            3,
        );
    }
}

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError('getRandom: more elements taken than available');
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}
