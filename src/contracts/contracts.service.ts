import { Injectable, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContractDto } from './contracts.dto';
import { Contract } from '../entities/contract.entity';
import { Job } from '../entities/job.entity';

@Injectable()
export class ContractsService {
    constructor(
        @InjectRepository(Contract)
        private readonly contractRepository: Repository<Contract>,
    ) {}

    async getContractById(contractId: number): Promise<Contract> {
        return this.contractRepository.findOne(contractId);
    }

    async createNewContract(createContractDto: CreateContractDto) {
        createContractDto.createdTime = new Date();
        return this.contractRepository.insert(createContractDto);
    }

    async acceptContract(status: number): Promise<any>{
        let res: any = null;
        if (verifyApprovalDto.approve) {
            res = await this.contractRepository.update(verifyApprovalDto.user, {
                isVerified: true,
            });
        }
        return res;
    }
}
