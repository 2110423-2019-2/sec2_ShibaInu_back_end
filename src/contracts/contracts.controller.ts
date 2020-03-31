import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto, UpdateContractDto, AcceptContractDto} from './contracts.dto';

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

    @Patch('/accept/:contractId')
    async acceptContract(
        @Param('contractId') contractId: number,
        @Body() acceptContractDto: AcceptContractDto) {
        acceptContractDto.contractId = contractId;
        return this.contractService.acceptContract(acceptContractDto);
    }
}
