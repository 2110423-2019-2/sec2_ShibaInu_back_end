import { User } from '../entities/user.entity';

export class CreateNotificationDto {
    topic: string;
    description: string;
    createdTime?: Date;
    isRead?: boolean;
    user?: User;
    link?: string;
}
