import { Injectable, Get, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContractDto, UpdateContractDto } from './contracts.dto';
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
        let res: any = await this.contractRepository.findOne({
            where: { jobId: jobIdParam },
        });
        if (!res) throw new BadRequestException('Invalid jobId');
        return res;
    }

    async createNewContract(createContractDto: CreateContractDto) {
        createContractDto.createdTime = new Date();
        let res: any = await this.contractRepository.insert(createContractDto);
        this.jobRepository.update(createContractDto.jobId, {
            contractId: createContractDto.contractId,
        });
        if (!res) throw new BadRequestException('Failed to create contract');
        return res;
    }

    async acceptContract(updateContractDto: UpdateContractDto): Promise<any> {
        let res: any = null;
        if (updateContractDto.status == ContractStatus.ACCEPTED)
            updateContractDto.acceptedTime = new Date();
        res = await this.contractRepository.update(
            updateContractDto.contractId,
            updateContractDto,
        );
        if (!res) throw new BadRequestException('Invalid ContractId');
        return res;
    }

    async updateContractByJobId(
        jobIdParam: number,
        updateContractDto: UpdateContractDto,
    ): Promise<any> {
        let res: any = null;
        res = await this.contractRepository.update(
            await this.contractRepository.findOne({
                where: { jobId: jobIdParam },
            }),
            updateContractDto,
        );
        if (!res) throw new BadRequestException('Invalid JobId');
        return res;
    }

    async deleteContractByJobId(jobIdParam: number): Promise<any> {
        let contract: Contract = await this.contractRepository.findOne({
            where: { jobId: jobIdParam },
        });
        if (!contract) throw new BadRequestException('Invalid JobId');
        let res: any = null;
        if (contract.status != ContractStatus.ACCEPTED) {
            await this.jobRepository.update(
                await this.jobRepository.findOne(jobIdParam),
                { contractId: null },
            );
            res = await this.contractRepository.delete({ jobId: jobIdParam });
        }
        if (!res) throw new BadRequestException('Invalid status: ACCEPTED');
        return res;
    }
}
