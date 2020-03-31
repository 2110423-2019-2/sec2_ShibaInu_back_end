import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './contracts.dto';
import { Status } from 'src/entities/job.entity';

@Controller('contracts')
export class ContractsController {
    constructor(private readonly contractService: ContractsService) {}

    @Get(':contractId')
    async getContractById(@Param('contractId') contractId: number) {
        return this.contractService.getContractById(contractId);
    }

    @Post()
    async createNewContract(@Body() createContractDto: CreateContractDto) {
        return this.contractService.createNewContract(createContractDto);
    }

    @Patch('/accept/:')
    async acceptContract(@Body() updateContractDto: number) {
        return this.contractService.acceptContract(status);
    }
}
