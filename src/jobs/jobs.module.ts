import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from '../entities/job.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [TypeOrmModule.forFeature([Job]), PassportModule.register({ defaultStrategy: 'jwt' })],
    controllers: [JobsController],
    providers: [JobsService],
})
export class JobsModule {}
