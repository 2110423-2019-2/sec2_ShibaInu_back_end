import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContractDto, UpdateContractDto } from './contracts.dto';
import { Contract, ContractStatus } from '../entities/contract.entity';
import { Job, Status } from '../entities/job.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ContractsService {
    constructor(
        @InjectRepository(Contract)
        private readonly contractRepository: Repository<Contract>,

        @InjectRepository(Job)
        private readonly jobRepository: Repository<Job>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async getContractById(contractId: number): Promise<Contract> {
        return this.contractRepository.findOne(contractId);
    }

    async getContractByJobId(jobIdParam: number): Promise<Contract> {
        const res: any = await this.contractRepository.findOne({
            where: { jobId: jobIdParam },
        });
        if (!res) throw new BadRequestException('Invalid jobId');
        return res;
    }

    async createNewContract(createContractDto: CreateContractDto) {
        const res: any = await this.contractRepository.insert(
            createContractDto,
        );
        this.jobRepository.update(createContractDto.jobId, {
            contractId: createContractDto.contractId,
        });
        if (!res) throw new BadRequestException('Failed to create contract');
        return res;
    }

    async acceptContract(updateContractDto: UpdateContractDto): Promise<any> {
        if (updateContractDto.status === ContractStatus.ACCEPTED) {
            updateContractDto.acceptedTime = new Date();
            const contract: Contract = await this.contractRepository.findOne(
                updateContractDto.contractId,
            );
            const freelancer: User = await this.userRepository.findOne(
                contract.freelancerId,
            );
            await this.jobRepository.update(contract.jobId, {
                status: Status.ACCEPTED,
                acceptedTime: new Date(),
                freelancerId: freelancer.userId,
                freelancerFullname:
                    freelancer.firstName + ' ' + freelancer.lastName,
            });
        }
        const res: any = await this.contractRepository.update(
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
        const res: any = await this.contractRepository.update(
            await this.contractRepository.findOne({
                where: { jobId: jobIdParam },
            }),
            updateContractDto,
        );
        if (!res) throw new BadRequestException('Invalid JobId');
        return res;
    }

    async deleteContractByJobId(jobIdParam: number): Promise<any> {
        const contract: Contract = await this.contractRepository.findOne({
            where: { jobId: jobIdParam },
        });
        if (!contract) throw new BadRequestException('Invalid JobId');
        if (contract.status != ContractStatus.ACCEPTED) {
            await this.jobRepository.update(
                await this.jobRepository.findOne(jobIdParam),
                { contractId: null },
            );
        } else {
            throw new BadRequestException('Invalid status: ACCEPTED');
        }
        const res: any = await this.contractRepository.delete({
            jobId: jobIdParam,
        });
        return res;
    }
}
