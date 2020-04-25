import { ContractStatus } from '../entities/contract.entity';

export class CreateContractDto {
    contractId: number;
    jobId: number;
    freelancerId: number;
    price: number;
    status?: ContractStatus;
    description: string;
    createdTime?: Date;
    updatedTime?: Date;
    acceptedTime?: Date;
}

export class UpdateContractDto {
    contractId?: number;
    jobId?: number;
    freelancerId?: number;
    price?: number;
    status?: ContractStatus;
    description?: string;
    createdTime?: Date;
    updatedTime?: Date;
    acceptedTime?: Date;
}
