import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './bids.dto';

@Controller('bids')
export class BidsController {
    constructor(private readonly bidService: BidsService) {}

    @Get('bidId/:jobId')
    async getBidIdByjobId(@Param('jobId') jobId: number){
        return this.bidService.getBidIdByJobId(jobId);
    }

    @Get(':bidId')
    async getBidById(@Param('bidId') bidId: number) {
        return this.bidService.getBidById(bidId);
    }  

    @Post()
    async createNewBid(@Body() createBidDto: CreateBidDto) {
        return this.bidService.createNewBid(createBidDto);
    }
}
