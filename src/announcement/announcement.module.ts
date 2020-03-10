import { Module } from '@nestjs/common';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from '../entities/announcement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Announcement])],
  controllers: [AnnouncementController],
  providers: [AnnouncementService]
})
export class AnnouncementModule {}
