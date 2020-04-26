import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './notification.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Get()
    async getAllNoti() {
        return this.notificationService.getAllNoti();
    }

    @Get(':userId')
    async getNotibyUserId(@Param('userId') userId: number) {
        return this.notificationService.getNotibyUserId(userId);
    }

    @Post()
    async addNewNoti(@Body() createNotificationDto: CreateNotificationDto) {
        return this.notificationService.addNewNoti(createNotificationDto);
    }

    @Patch(':notificationId')
    async readNoti(@Param('notificationId') notificationId: number) {
        return this.notificationService.readNoti(notificationId);
    }
}
