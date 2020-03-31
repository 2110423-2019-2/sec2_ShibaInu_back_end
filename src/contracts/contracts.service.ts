import { Injectable, Get, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContractDto, AcceptContractDto } from './contracts.dto';
import { Contract } from '../entities/contract.entity';
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
}
