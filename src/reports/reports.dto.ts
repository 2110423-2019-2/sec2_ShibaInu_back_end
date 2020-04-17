import { TopicTypeEnum, ReportStatusEnum } from '../entities/report.entity';
import { User } from '../entities/user.entity';

export class CreateReportDto {
    topicName: string;
    topicType: TopicTypeEnum;
    description: string;
    status?: ReportStatusEnum;
    createdTime?: Date;
    user: User;
}
