import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from '../entities/jobs.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Job])],
    controllers: [JobsController],
    providers: [JobsService],
})
export class JobsModule {}
