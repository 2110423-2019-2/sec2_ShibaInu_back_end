import { User } from '../entities/user.entity';
import {
    Status,
    Catergory,
    JobReqSkill,
    JobOptSkill,
} from '../entities/job.entity';

export class CreateJobDto {
    name: string;
    description: string;
    estimatedDuration: number;
    estimatedWage: number;
    catergory: Catergory;
    status?: Status;
    createdTime?: Date;
    updatedTime?: Date;
    client: User;
    requiredSkills: JobReqSkill[];
    optionalSkills: JobOptSkill[];
}

export class UpdateJobDto {
    jobId?: number;
    name?: string;
    description?: string;
    estimatedDuration?: number;
    estimatedWage?: number;
    catergory?: Catergory;
    status?: Status;
    createdTime?: Date;
    updatedTime?: Date;
    requiredSkills?: JobReqSkill[];
    optionalSkills?: JobOptSkill[];
}
