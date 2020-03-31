import { Job } from '../entities/job.entity';
import { Timestamp } from 'typeorm';

export class CreateContractDto {
    contractId: number;
    clientId: number;
    freelancerId: number;
    jobId: number;
    description: string;
    createdTime?: Date;
    modifiedTime?: Date;
}

export class UpdateContractDto {

    contractId: number;
    clientId: number;
    freelancerId: number;
    jobId: number;
    description: string;
    createdTime?: Date;
    modifiedTime?: Date;
}

export class 