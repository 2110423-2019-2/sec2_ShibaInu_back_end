import { Job } from '../entities/job.entity';
import { Timestamp } from 'typeorm';

export class CreateContractDto {
    contractId: number;
    createdTime?: Date;
}
