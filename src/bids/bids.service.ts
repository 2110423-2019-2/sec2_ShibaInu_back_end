import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBidDto } from './bids.dto';
import { Bid } from '../entities/bid.entity';
import { Job } from '../entities/job.entity';

@Injectable()
export class BidsService {
    constructor(
        @InjectRepository(Bid)
        private readonly bidRepository: Repository<Bid>,

        @InjectRepository(Job)
        private readonly jobRepository: Repository<Job>,
    ) {}

    async getBidIdByJobId(jobIdParam: number): Promise<Bid[]> {
        return this.bidRepository.find({
            where: { jobId: jobIdParam },
        });
    }

    async getJobByUserId(userId: number): Promise<Job[]> {
        const temp = await this.bidRepository.find({
            where: { userId: userId },
            select: ['jobId'],
        });
        if (temp.length === 0) {
            return [];
        }
        return this.jobRepository.findByIds(temp);
    }

    async getBidByJobUserId(
        jobIdParam: number,
        userIdParam: number,
    ): Promise<Bid> {
        const res = await this.bidRepository.find({
            where: {
                jobId: jobIdParam,
                userId: userIdParam,
            },
        });
        if (res.length === 0)
            throw new BadRequestException('Invalid jobId or userId');
        return res[0];
    }

    async getBidById(bidId: number): Promise<Bid> {
        return this.bidRepository.findOne(bidId);
    }

    async createNewBid(createBidDto: CreateBidDto) {
        createBidDto.createdTime = new Date();
        return this.bidRepository.insert(createBidDto);
    }
}
