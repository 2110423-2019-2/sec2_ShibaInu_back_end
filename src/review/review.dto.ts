import { User } from '../entities/user.entity';
import { ReviewerRole } from '../entities/review.entity';

export class CreateReviewDto {
    description: string;
    score: number;
    reviewee: any;
    reviewer: User;
    reviewerRole: ReviewerRole;
    job: any;
    jobName?: string;
    createdTime?: Date;
}

export class EditReviewDto {
    reviewId?: number;
    description?: string;
    score?: number;
}
