import { User } from 'src/entities/user.entity';

export class CreateReviewDto {
    description: string;
    reviewee: User;
    reviewer: User;
}

export class EditReviewDto {
    reviewId?: number;
    description: string;
}
