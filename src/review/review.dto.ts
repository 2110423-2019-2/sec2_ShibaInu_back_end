import { User } from '../entities/user.entity';
import { Job } from '../entities/job.entity';

export class CreateReviewDto {
    description: string;
    score: number;
    reviewee: User;
    reviewer: User;
    job: Job;
    jobName?: string;
    createdTime?: Date;
}

export class EditReviewDto {
    reviewId?: number;
    description?: string;
    score?: number;
}
