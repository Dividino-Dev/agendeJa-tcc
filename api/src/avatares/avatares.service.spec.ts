import { Test, TestingModule } from '@nestjs/testing';
import { AvataresService } from './avatares.service';

describe('AvataresService', () => {
  let service: AvataresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvataresService],
    }).compile();

    service = module.get<AvataresService>(AvataresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
