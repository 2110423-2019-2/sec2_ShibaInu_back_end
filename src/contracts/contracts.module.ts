import { Module } from '@nestjs/common';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from '../entities/contract.entity';
import { Job } from '../entities/job.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Contract, Job])],
    controllers: [ContractsController],
    providers: [ContractsService],
})
export class ContractsModule {}
