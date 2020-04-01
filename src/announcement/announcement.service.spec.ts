import { Test, TestingModule } from '@nestjs/testing';
import { AnnouncementService } from './announcement.service';
import { Repository } from 'typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from '../users/users.service';

describe('AnnouncementService', () => {
    let service: AnnouncementService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AnnouncementService,
                {
                    provide: 'AnnouncementRepository',
                    useClass: Repository,
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
        }).compile();

        service = module.get<AnnouncementService>(AnnouncementService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
