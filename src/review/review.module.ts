import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/entities/review.entity';
import { JobsService } from 'src/jobs/jobs.service';
import { Job, JobOptSkill, JobReqSkill } from 'src/entities/job.entity';
import { InterestedCategory } from 'src/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Review,Job,InterestedCategory,
        Job,
        JobOptSkill,
        JobReqSkill,])],
    controllers: [ReviewController],
    providers: [ReviewService,JobsService],
    exports: [ReviewService],
})
export class ReviewModule {}
