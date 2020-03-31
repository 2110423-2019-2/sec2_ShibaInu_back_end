import { Job } from '../entities/job.entity';
import { Timestamp } from 'typeorm';
import { ContractStatus, Contract } from 'src/entities/contract.entity';

export class CreateContractDto {
    contractId: number;
    jobId: number;
    status?: ContractStatus;
    description: string;
    createdTime?: Date;
    updatedTime?: Date;
}

export class UpdateContractDto {
    contractId?: number;
    jobId?: number;
    status?: ContractStatus;
    description?: string;
    createdTime?: Date;
    updatedTime?: Date;
}

export class AcceptContractDto {
    contractId?: number;
    status: ContractStatus;
}