import { User } from '../entities/user.entity';

export class CreateAnnouncementDto {
    title: string;
    announcement: string;
    creator?: User;
}
