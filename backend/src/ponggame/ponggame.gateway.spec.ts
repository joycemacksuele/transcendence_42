import { Test, TestingModule } from '@nestjs/testing';
import { PonggameGateway } from './ponggame.gateway';
import { PonggameService } from './ponggame.service';

describe('PonggameGateway', () => {
  let gateway: PonggameGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PonggameGateway, PonggameService],
    }).compile();

    gateway = module.get<PonggameGateway>(PonggameGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
