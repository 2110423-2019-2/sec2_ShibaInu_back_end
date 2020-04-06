import { Module } from '@nestjs/common';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from '../entities/announcement.entity';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Announcement]),
        PassportModule.registerAsync({
            useFactory: () => ({
                defaultStrategy: 'jwt',
            }),
        }),
        UsersModule,
    ],
    controllers: [AnnouncementController],
    providers: [AnnouncementService],
})
export class AnnouncementModule {}
