import { User } from "../entities/user.entity";

export class CreateJobDto {
    jobName: string;
    jobDescription: string;
    jobPicture: string;
    estimatedDuration: number;
    estimatedWage: number;
    client: User;
    createdTime?: Date;
}
