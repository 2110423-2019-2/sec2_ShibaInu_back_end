import { Injectable, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBidDto } from './bids.dto';
import { Bid } from 'src/entities/bid.entity';

@Injectable()
export class BidsService {
    constructor(
        @InjectRepository(Bid)
        private readonly bidRepository: Repository<Bid>,
    ) {}

    async getBidIdByJobId(jobIdParam: number): Promise<Bid[]>{
        return this.bidRepository.find({
            where: {jobId:jobIdParam}
        });
    }

    async getBidById(bidId: number): Promise<Bid> {
        return this.bidRepository.findOne(bidId);
    }  

    async createNewBid(createBidDto: CreateBidDto) {
        createBidDto.createdTime = new Date();
        return this.bidRepository.insert(createBidDto);
    }
}
