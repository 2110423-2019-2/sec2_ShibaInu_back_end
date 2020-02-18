import { User } from "../entities/user.entity";
import { Job } from "../entities/job.entity";
import { Timestamp } from "typeorm";

export class CreateBidDto {
    biddedWage: number;
    biddedDuration: number;
    createdTime?: Date;
}

