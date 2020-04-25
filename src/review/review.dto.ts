import { User } from '../entities/user.entity';

export class CreateReviewDto {
    description: string;
    score: number;
    reviewee: any;
    reviewer: User;
    job: any;
    jobName?: string;
    createdTime?: Date;
}

export class EditReviewDto {
    reviewId?: number;
    description?: string;
    score?: number;
}
