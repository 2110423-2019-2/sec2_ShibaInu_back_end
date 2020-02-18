import { User } from '../entities/user.entity';
import { Status, Catergory } from 'src/entities/job.entity';
import { JobReqSkill } from 'src/entities/jobReqSkill.entity';
import { JobOptSkill } from 'src/entities/JobOptSkill.entity';

export class CreateJobDto {
    name: string;
    description: string;
    picture: string;
    estimatedDuration: number;
    estimatedWage: number;
    catergory: Catergory;
    status?: Status;
    createdTime?: Date;
    client: User;
    requiredSkills: JobReqSkill[];
    optionalSkills: JobOptSkill[];
}

export class UpdateJobDto {
    jobId?: number;
    name: string;
    description: string;
    picture: string;
    estimatedDuration: number;
    estimatedWage: number;
    catergory: Catergory;
    status?: Status;
    createdTime?: Date;
    client: User;
    requiredSkills: JobReqSkill[];
    optionalSkills: JobOptSkill[];
}
