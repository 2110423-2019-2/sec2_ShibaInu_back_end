import {
    Injectable,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InterestedCategory, User } from '../entities/user.entity';
import { Job, JobReqSkill, JobOptSkill, Status } from '../entities/job.entity';
import { Repository, Like, Between } from 'typeorm';
import { CreateJobDto, UpdateJobDto } from './jobs.dto';
import { Bid } from '../entities/bid.entity';

@Injectable()
export class JobsService {
    constructor(
        @InjectRepository(Job)
        private readonly jobRepository: Repository<Job>,

        @InjectRepository(InterestedCategory)
        private readonly interestedCategoryRepository: Repository<
            InterestedCategory
        >,

        @InjectRepository(Bid)
        private readonly bidRepository: Repository<Bid>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

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
        status: string,
    ): Promise<Job[]> {
        if (!name) name = '';
        if (!cat) cat = '';
        if (!status) status = '';
        if (!w1) w1 = 0;
        if (!w2) w2 = 9999999999999;
        if (!t1) t1 = 0;
        if (!t2) t2 = 2147483647;
        const a = await this.jobRepository.find({
            select: ['jobId'],
            where: {
                name: Like(`%${name}%`),
                estimatedWage: Between(w1, w2),
                estimatedDuration: Between(t1, t2),
                catergory: Like(`%${cat}%`),
                status: Like(`%${status}%`),
            },
        });
        let data = [[]];
        for (let i = 0; i < a.length; i++) data[0].push(a[i].jobId);
        if (rs1) {
            const reqs1 = await this.jobReqSkillRepository.find({
                where: { skill: rs1 },
            });
            data.push([]);
            for (let i = 0; i < reqs1.length; i++)
                data[data.length - 1].push(reqs1[i].jobId);
        }
        if (rs2) {
            const reqs2 = await this.jobReqSkillRepository.find({
                where: { skill: rs2 },
            });
            data.push([]);
            for (let i = 0; i < reqs2.length; i++)
                data[data.length - 1].push(reqs2[i].jobId);
        }
        if (rs3) {
            const reqs3 = await this.jobReqSkillRepository.find({
                where: { skill: rs3 },
            });
            data.push([]);
            for (let i = 0; i < reqs3.length; i++)
                data[data.length - 1].push(reqs3[i].jobId);
        }
        if (os1) {
            const opts1 = await this.jobOptSkillRepository.find({
                where: { skill: os1 },
            });
            data.push([]);
            for (let i = 0; i < opts1.length; i++)
                data[data.length - 1].push(opts1[i].jobId);
        }
        if (os2) {
            const opts2 = await this.jobOptSkillRepository.find({
                where: { skill: os2 },
            });
            data.push([]);
            for (let i = 0; i < opts2.length; i++)
                data[data.length - 1].push(opts2[i].jobId);
        }
        if (os3) {
            const opts3 = await this.jobOptSkillRepository.find({
                where: { skill: os3 },
            });
            data.push([]);
            for (let i = 0; i < opts3.length; i++)
                data[data.length - 1].push(opts3[i].jobId);
        }
        const jobIds = data.reduce((a, b) => a.filter(c => b.includes(c)));
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
        const res: any = await this.jobRepository.findOne(jobId);
        if (!res) throw new BadRequestException('invalid jobId');
        return res;
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

    async editJob(jobId: number, userId: number, updateJobDto: UpdateJobDto) {
        if (
            userId !=
            (await (await this.jobRepository.findOne(jobId)).client.userId)
        )
            throw new ForbiddenException(`Only job owner can edit this job!`);
        if (updateJobDto.requiredSkills) {
            const updateJobReqSkills = updateJobDto.requiredSkills;
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
            const updateJobOptSkills = updateJobDto.optionalSkills;
            await this.jobOptSkillRepository.delete({ job: { jobId: jobId } });
            for (let i = 0; i < updateJobOptSkills.length; i++) {
                this.jobOptSkillRepository.insert({
                    skill: updateJobOptSkills[i].skill,
                    job: { jobId: jobId },
                });
            }
            delete updateJobDto.optionalSkills;
        }
        if (updateJobDto.status === Status.ACCEPTED) {
            updateJobDto.acceptedTime = new Date();
        } else if (updateJobDto.status === Status.WORKING) {
            updateJobDto.startWorkingTime = new Date();
        } else if (updateJobDto.status === Status.DONE) {
            updateJobDto.doneTime = new Date();
        } else if (updateJobDto.status === Status.CLOSED) {
            updateJobDto.closedTime = new Date();
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
        const userCategory = await this.interestedCategoryRepository.find({
            where: { userId: freelancerUserId },
        });
        let categories = [];
        for (let i = 0; i < userCategory.length; i++) {
            categories.push(userCategory[i].interestedCategory);
        }

        const allOpenJob = await this.jobRepository.find({
            where: {
                status: 'open',
            },
        });

        let candidateJob = [];
        allOpenJob.forEach(job => {
            if (categories.includes(job.catergory)) candidateJob.push(job);
        });

        return getRandom(candidateJob, 3);
    }

    async finishJob(updateJobDto: UpdateJobDto) {
        if ((await this.jobRepository.findOne(updateJobDto.jobId)).url != '')
            throw new ForbiddenException('url is already assigned');
        if (updateJobDto.status === Status.ACCEPTED) {
            updateJobDto.acceptedTime = new Date();
        } else if (updateJobDto.status === Status.WORKING) {
            updateJobDto.startWorkingTime = new Date();
        } else if (updateJobDto.status === Status.DONE) {
            updateJobDto.doneTime = new Date();
        } else if (updateJobDto.status === Status.CLOSED) {
            updateJobDto.closedTime = new Date();
        }
        updateJobDto.updatedTime = new Date();
        return this.jobRepository.update(updateJobDto.jobId, updateJobDto);
    }

    async confirmJob(jobId: number, boolean: number, userId: number) {
        const job: Job = await this.jobRepository.findOne(jobId);
        if (userId != job.client.userId)
            throw new ForbiddenException(`Only job owner can edit this job!`);
        let res: any = null;
        if (Number(boolean) === 0)
            res = this.jobRepository.update(job, {
                status: Status.WORKING,
                url: '',
            });
        else
            res = this.jobRepository.update(job, {
                status: Status.DONE,
                doneTime: new Date(),
            });
        return res;
    }

    async getJobLinkByJobId(jobId: number): Promise<string> {
        const res = (await this.jobRepository.findOne(jobId)).url;
        if (!res) throw new BadRequestException('invalid jobId');
        return res;
    }

    async getInterestedFreelancersById(jobId: number): Promise<User[]> {
        const userIds = await this.bidRepository.find({
            select: ['userId'],
            where: { jobId: jobId },
        });
        return this.userRepository.findByIds(userIds);
    }
}

function getRandom(arr, n) {
    let result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len) return arr;
    while (n--) {
        let x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}
