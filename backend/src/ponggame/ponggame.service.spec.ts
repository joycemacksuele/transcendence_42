import { Test, TestingModule } from '@nestjs/testing';
import { PonggameService } from './ponggame.service';

describe('PonggameService', () => {
  let service: PonggameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PonggameService],
    }).compile();

    service = module.get<PonggameService>(PonggameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
