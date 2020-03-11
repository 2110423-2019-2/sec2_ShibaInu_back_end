import { Test, TestingModule } from '@nestjs/testing';
import { AnnouncementService } from './announcement.service';
import { Repository } from 'typeorm';

describe('AnnouncementService', () => {
  let service: AnnouncementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnnouncementService,
      {
        provide: 'AnnouncementRepository',
        useClass: Repository,
      }],
    }).compile();

    service = module.get<AnnouncementService>(AnnouncementService);

    
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an announcement', () => {
    expect(service.createAnnouncement).toBeCalled()
  })
});
