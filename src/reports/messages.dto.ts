import { User } from '../entities/user.entity';
import { Report } from '../entities/report.entity';

export class CreateMessageDto {
    detail: string;
    createdTime?: Date;
    user: User;
    report: Report;
}
