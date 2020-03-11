import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InterestedCategory } from '../entities/user.entity';
import {
    Job,
    JobReqSkill,
    JobOptSkill,
    Catergory,
} from '../entities/job.entity';
import { Repository, Like, Between } from 'typeorm';
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

    async getAllJobs(
        name: string,
        w1: number,
        w2: number,
        t1: number,
        t2: number,
        cat: string,
        rs1: string,
        rs2: string,
        rs3: string,
        os1: string,
        os2: string,
        os3: string,
        sort: number,
    ): Promise<Job[]> {
        if (!name) name = '';
        if (!cat) cat = '';
        if (!w1 || !w2) {
            w1 = 0;
            w2 = 9999999999999;
        }
        if (!t1 || !t2) {
            t1 = 0;
            t2 = 2147483647;
        }
        let a = await this.jobRepository.find({
            select: ['jobId'],
            where: {
                name: Like(`%${name}%`),
                estimatedWage: Between(w1, w2),
                estimatedDuration: Between(t1, t2),
                catergory: Like(`%${cat}%`),
            },
        });
        let data = [[]];
        for (let i = 0; i < a.length; i++) data[0].push(a[i].jobId);
        if (rs1) {
            let reqs1 = await this.jobRepository.query(
                `select jobId from job where jobId in (select jobId from job_req_skill where skill = '${rs1}')`,
            );
            data.push([]);
            for (let i = 0; i < reqs1.length; i++)
                data[data.length - 1].push(reqs1[i].jobId);
        }
        if (rs2) {
            let reqs2 = await this.jobRepository.query(
                `select jobId from job where jobId in (select jobId from job_req_skill where skill = '${rs2}')`,
            );
            data.push([]);
            for (let i = 0; i < reqs2.length; i++)
                data[data.length - 1].push(reqs2[i].jobId);
        }
        if (rs3) {
            let reqs3 = await this.jobRepository.query(
                `select jobId from job where jobId in (select jobId from job_req_skill where skill = '${rs3}')`,
            );
            data.push([]);
            for (let i = 0; i < reqs3.length; i++)
                data[data.length - 1].push(reqs3[i].jobId);
        }
        if (os1) {
            let opts1 = await this.jobRepository.query(
                `select jobId from job where jobId in (select jobId from job_opt_skill where skill = '${os1}')`,
            );
            data.push([]);
            for (let i = 0; i < opts1.length; i++)
                data[data.length - 1].push(opts1[i].jobId);
        }
        if (os2) {
            let opts2 = await this.jobRepository.query(
                `select jobId from job where jobId in (select jobId from job_opt_skill where skill = '${os2}')`,
            );
            data.push([]);
            for (let i = 0; i < opts2.length; i++)
                data[data.length - 1].push(opts2[i].jobId);
        }
        if (os3) {
            let opts3 = await this.jobRepository.query(
                `select jobId from job where jobId in (select jobId from job_opt_skill where skill = '${os3}')`,
            );
            data.push([]);
            for (let i = 0; i < opts3.length; i++)
                data[data.length - 1].push(opts3[i].jobId);
        }
        let jobIds = data.reduce((a, b) => a.filter(c => b.includes(c)));
        let sorting: Object;
        switch (Number(sort)) {
            case 0:
                sorting = { updatedTime: 'DESC' };
                break;
            case 1:
                sorting = { updatedTime: 'ASC' };
                break;
            case 2:
                sorting = { estimatedWage: 'DESC' };
                break;
            case 3:
                sorting = { estimatedWage: 'ASC' };
                break;
            case 4:
                sorting = { estimatedDuration: 'DESC' };
                break;
            case 5:
                sorting = { estimatedDuration: 'ASC' };
                break;
            default:
                sorting = { updatedTime: 'DESC' };
                break;
        }
        return this.jobRepository.findByIds(jobIds, { order: sorting });
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
