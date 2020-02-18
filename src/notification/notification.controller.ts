import { Controller, Get, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './notification.dto';

@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Get()
    async getAllNoti(){
        return this.notificationService.getAllNoti();
    }

    @Post()
    async addNewNoti(@Body() createNotificationDto: CreateNotificationDto){
        return this.notificationService.addNewNoti(createNotificationDto);
    }
}
