import { User } from "../entities/user.entity";

export class CreateJobDto {
    name: string;
    description: string;
    picture: string;
    estimatedDuration: number;
    estimatedWage: number;
    client: User;
    createdTime?: Date;
}
