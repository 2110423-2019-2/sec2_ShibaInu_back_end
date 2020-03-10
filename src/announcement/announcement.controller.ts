import { Controller, Get, Param, Post, Body, Patch, Delete } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { CreateAnnouncementDto } from './announcement.dto';

@Controller('announcement')
export class AnnouncementController {
    constructor(private readonly announcementService: AnnouncementService) {}

    @Get()
    async getAllAnnouncements() {
        return this.announcementService.getAllAnnouncements();
    }

    @Get(':id')
    async getAnnouncementById(@Param('id') id: number) {
        return this.announcementService.getAnnouncementById(id);
    }

    @Post()
    async createAnnouncement(@Body() createAnnouncementDto: CreateAnnouncementDto) {
        return this.announcementService.createAnnouncement(createAnnouncementDto);
    }

    @Patch(':id')
    async editAnnouncement(@Param('id') id: number, @Body() createAnnouncementDto: CreateAnnouncementDto) {
        return this.announcementService.editAnnouncement(id, createAnnouncementDto);
    }

    @Delete(':id')
    async deleteAnnouncement(@Param('id') id: number) {
        return this.announcementService.deleteAnnouncement(id);
    }
}
