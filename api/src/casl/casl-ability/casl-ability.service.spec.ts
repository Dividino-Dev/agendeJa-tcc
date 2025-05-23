import { Test, TestingModule } from '@nestjs/testing';
import { CaslAbilityService } from './casl-ability.service';

describe('CaslAbilityService', () => {
  let service: CaslAbilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaslAbilityService],
    }).compile();


    service = await module.resolve<CaslAbilityService>(CaslAbilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
