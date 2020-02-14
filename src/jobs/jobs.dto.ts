import { User } from "../entities/user.entity";
import { Status, Catergory } from "src/entities/job.entity";

export class CreateJobDto {
    name: string;
    description: string;
    picture: string;
    estimatedDuration: number;
    estimatedWage: number;
    caergory: Catergory;
    status?: Status;
    createdTime?: Date;
    client: User;
}

// export class CreateJobWithSkillDto {
//     name: string;
//     description: string;
//     picture: string;
//     estimatedDuration: number;
//     estimatedWage: number;
//     caergory: Catergory;
//     status?: Status;
//     createdTime?: Date;
//     requiredSkills?: string[];
//     optionalSkills?: string[];
//     client: User;
//}

