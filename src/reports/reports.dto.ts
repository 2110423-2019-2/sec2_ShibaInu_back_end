import { TopicTypeEnum, ReportStatusEnum } from '../entities/report.entity';
import { User } from '../entities/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReportDto {
    topicName: string;
    topicType: TopicTypeEnum;
    description: string;
    status?: ReportStatusEnum;
    createdTime?: Date;
    user: User;
}
