import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Patch,
    Delete,
} from '@nestjs/common';
import { ContractsService } from './contracts.service';
import {
    CreateContractDto,
    UpdateContractDto,
    AcceptContractDto,
} from './contracts.dto';

@Controller('contracts')
export class ContractsController {
    constructor(private readonly contractService: ContractsService) {}

    @Get(':contractId')
    async getContractById(@Param('contractId') contractId: number) {
        return this.contractService.getContractById(contractId);
    }

    @Get('/jobId/:contractId')
    async getContractByJobId(@Param('contractId') contractId: number) {
        return this.contractService.getContractByJobId(contractId);
    }

    @Post()
    async createNewContract(@Body() createContractDto: CreateContractDto) {
        return this.contractService.createNewContract(createContractDto);
    }

    @Patch('/accept/:contractId')
    async acceptContract(
        @Param('contractId') contractId: number,
        @Body() acceptContractDto: AcceptContractDto,
    ) {
        acceptContractDto.contractId = contractId;
        return this.contractService.acceptContract(acceptContractDto);
    }

    @Delete('/deleteByJobId/:jobId')
    async deleteContractByJobId(@Param('jobId') jobId: number) {
        return this.contractService.deleteContractByJobId(jobId);
    }

    @Patch('/updateByJobId/:jobId')
    async editContractByJobId(
        @Param('jobId') jobId: number,
        @Body() updateContractDto: UpdateContractDto,
    ) {
        return this.contractService.updateContractByJobId(
            jobId,
            updateContractDto,
        );
    }
}
