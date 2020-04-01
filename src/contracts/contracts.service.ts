import { Injectable, Get, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContractDto, AcceptContractDto } from './contracts.dto';
import { Contract, ContractStatus } from '../entities/contract.entity';
import { Job, Status } from '../entities/job.entity';

@Injectable()
export class ContractsService {
    constructor(
        @InjectRepository(Contract)
        private readonly contractRepository: Repository<Contract>,

        @InjectRepository(Job)
        private readonly jobRepository: Repository<Job>,
    ) {}

    async getContractById(contractId: number): Promise<Contract> {
        return this.contractRepository.findOne(contractId);
    }

    async getContractByJobId(jobIdParam: number): Promise<Contract> {
        return this.contractRepository.findOne({
            where: { jobId: jobIdParam },
        });
    }

    async createNewContract(createContractDto: CreateContractDto) {
        createContractDto.createdTime = new Date();
        return this.contractRepository.insert(createContractDto);
    }

    async acceptContract(acceptContractDto: AcceptContractDto): Promise<any> {
        let res: any = null;
        res = await this.contractRepository.update(
            acceptContractDto.contractId,
            acceptContractDto,
        );
        if (!res) throw new BadRequestException('Invalid ContractId');
        return res;
    }

    async deleteContractByJobId(jobIdParam: number): Promise<any>{
        let contract: Contract = await this.contractRepository.findOne({
            where: { jobId: jobIdParam }
        });
        if (!contract) throw new BadRequestException('Invalid JobId');
        let res: any = null;
        if (contract.status != ContractStatus.ACCEPTED) {
            res = await this.contractRepository.delete({ jobId: jobIdParam })
        }
        if (!res) throw new BadRequestException('Invalid status: ACCEPTED');
        return res;
    }
}
