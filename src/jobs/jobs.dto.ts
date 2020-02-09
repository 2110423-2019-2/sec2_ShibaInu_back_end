import { User } from "../entities/user.entity";

export class CreateJobDto {
    name: string;
    description: string;
    payout: number;
    createdTime?: Date;
	client: User;
}
