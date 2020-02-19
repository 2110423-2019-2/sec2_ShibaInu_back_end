import { Module } from '@nestjs/common';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from 'src/entities/bid.entity';
import { Job } from 'src/entities/job.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Bid, Job])],
    controllers: [BidsController],
    providers: [BidsService],
})
export class BidsModule {}
