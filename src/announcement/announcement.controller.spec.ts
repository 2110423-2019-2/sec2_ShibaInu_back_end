import { Test, TestingModule } from '@nestjs/testing';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from '../users/users.service';

describe('Announcement Controller', () => {
    let controller: AnnouncementController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: 'AnnouncementService',
                    useValue: AnnouncementService,
                },
                PassportModule,
                {
                    provide: 'AuthModule',
                    useValue: AuthModule,
                },
                {
                    provide: 'UsersService',
                    useValue: UsersService,
                },
            ],
            controllers: [AnnouncementController],
        }).compile();

        controller = module.get<AnnouncementController>(AnnouncementController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
