import { User } from "src/entities/user.entity";

export class CreateReviewDto{
    description: string;
    reviewee: User;
    reviewer: User;
}