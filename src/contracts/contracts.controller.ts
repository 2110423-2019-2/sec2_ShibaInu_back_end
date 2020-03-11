import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './contracts.dto';

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
}
