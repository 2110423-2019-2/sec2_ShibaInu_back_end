import { User } from '../entities/user.entity';

export class CreateAnnouncementDto {
    title: string;
    content: string;
    creator?: User;
}
