import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Announcement } from '../entities/announcement.entity';
import { Repository } from 'typeorm';
import { CreateAnnouncementDto } from './announcement.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AnnouncementService {
    constructor(
        @InjectRepository(Announcement)
        private readonly announcementRepository: Repository<Announcement>,
        private readonly userService: UsersService,
    ) {}

    async getAllAnnouncements(): Promise<Announcement[]> {
        return this.announcementRepository.find();
    }

    async getAnnouncementById(id: number): Promise<Announcement> {
        return this.announcementRepository.findOne(id);
    }

    async createAnnouncement(
        createAnnouncementDto: CreateAnnouncementDto,
        creator: number,
    ) {
        createAnnouncementDto.creator = await this.userService.getUserById(
            creator,
        );
        return this.announcementRepository.insert(createAnnouncementDto);
    }

    async editAnnouncement(
        id: number,
        createAnnouncementDto: CreateAnnouncementDto,
    ) {
        return this.announcementRepository.update(id, createAnnouncementDto);
    }

    async deleteAnnouncement(id: number) {
        return this.announcementRepository.delete(id);
    }
}
