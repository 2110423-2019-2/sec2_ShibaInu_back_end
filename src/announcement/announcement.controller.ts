import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Patch,
    Delete,
    UseGuards,
    SetMetadata,
} from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { CreateAnnouncementDto } from './announcement.dto';
import { AdminGuard } from '../guards/admin.guard';
import { AuthGuard } from '@nestjs/passport';
import { LoadUser } from '../decorators/users.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Announcement')
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
    @UseGuards(AdminGuard)
    @SetMetadata('isadmin', [true])
    @UseGuards(AuthGuard())
    async createAnnouncement(
        @LoadUser() user: any,
        @Body() createAnnouncementDto: CreateAnnouncementDto,
    ) {
        return this.announcementService.createAnnouncement(
            createAnnouncementDto,
            user.id,
        );
    }

    @Patch(':id')
    @UseGuards(AdminGuard)
    @SetMetadata('isadmin', [true])
    @UseGuards(AuthGuard())
    async editAnnouncement(
        @Param('id') id: number,
        @Body() createAnnouncementDto: CreateAnnouncementDto,
    ) {
        return this.announcementService.editAnnouncement(
            id,
            createAnnouncementDto,
        );
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    @SetMetadata('isadmin', [true])
    @UseGuards(AuthGuard())
    async deleteAnnouncement(@Param('id') id: number) {
        return this.announcementService.deleteAnnouncement(id);
    }
}
