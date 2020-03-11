import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from '../entities/review.entity';
import { JobsService } from '../jobs/jobs.service';
import { Job, JobOptSkill, JobReqSkill } from '../entities/job.entity';
import {
    InterestedCategory,
    User,
    UserSkill,
    VerifyRequest,
} from '../entities/user.entity';
import { Bid } from '../entities/bid.entity';
import { BidsService } from '../bids/bids.service';
import { UsersService } from '../users/users.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Review,
            Job,
            InterestedCategory,
            JobOptSkill,
            JobReqSkill,
            Bid,
            User,
            UserSkill,
            VerifyRequest,
        ]),
    ],
    controllers: [ReviewController],
    providers: [ReviewService, JobsService, BidsService, UsersService],
    exports: [ReviewService],
})
export class ReviewModule {}
