import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNotificationDto } from './notification.dto';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private readonly noticationRepository: Repository<Notification>,
    ) {}

    async getAllNoti(): Promise<Notification[]>{
        return this.noticationRepository.find();
    }

    async addNewNoti(createNotificationDto: CreateNotificationDto){
        createNotificationDto.createdTime = new Date();
        createNotificationDto.isRead = false;
        return this.noticationRepository.insert(createNotificationDto);
    }
}
