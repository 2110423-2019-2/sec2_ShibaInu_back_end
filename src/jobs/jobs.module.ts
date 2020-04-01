import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterestedCategory, User } from '../entities/user.entity';
import { Job, JobOptSkill, JobReqSkill } from '../entities/job.entity';
import { PassportModule } from '@nestjs/passport';
import { Bid } from '../entities/bid.entity';
import { BidsService } from '../bids/bids.service';
import { Contract } from '../entities/contract.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            InterestedCategory,
            Bid,
            Job,
            JobOptSkill,
            JobReqSkill,
            User,
            Contract,
        ]),
        PassportModule.registerAsync({
            useFactory: () => ({
                defaultStrategy: 'jwt',
            }),
        }),
    ],
    controllers: [JobsController],
    providers: [JobsService, BidsService],
})
export class JobsModule {}
