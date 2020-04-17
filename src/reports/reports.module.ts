import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Message, Report } from '../entities/report.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        Report,
        Message,
        User,
    ]),
    PassportModule.registerAsync({
        useFactory: () => ({
            defaultStrategy: 'jwt',
        }),
    }),
],
  controllers: [ReportsController],
  providers: [ReportsService]
})
export class ReportsModule {}
