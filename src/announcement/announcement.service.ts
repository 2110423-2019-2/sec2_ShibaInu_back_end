import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Announcement } from '../entities/announcement.entity';
import { Repository } from 'typeorm';
import { CreateAnnouncementDto } from './announcement.dto';

@Injectable()
export class AnnouncementService {
    constructor(
        @InjectRepository(Announcement)
        private readonly announcementRepository: Repository<Announcement>
    ) {}

    async getAllAnnouncements(): Promise<Announcement[]> {
        return this.announcementRepository.find();
    }

    async getAnnouncementById(id: number): Promise<Announcement> {
        return this.announcementRepository.findOne(id);
    }

    async createAnnouncement(createAnnouncementDto: CreateAnnouncementDto) {
        return this.announcementRepository.insert(createAnnouncementDto);
    }

    async editAnnouncement(id: number, createAnnouncementDto: CreateAnnouncementDto) {
        return this.announcementRepository.update(id, createAnnouncementDto);
    }

    async deleteAnnouncement(id: number) {
        return this.announcementRepository.delete(id);
    }
}
