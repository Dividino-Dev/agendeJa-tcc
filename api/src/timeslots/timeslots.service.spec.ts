import { Test, TestingModule } from '@nestjs/testing';
import { TimeslotsService } from './timeslots.service';
import { PrismaService } from '../prisma/prisma.service';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';


describe('TimeslotsService', () => {
  let service: TimeslotsService;

  const prismaServiceMock = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const caslAbilityServiceMock = {
    defineAbilitiesFor: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimeslotsService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
        {
          provide: CaslAbilityService,
          useValue: caslAbilityServiceMock,
        },
      ],
    }).compile();

    service = module.get<TimeslotsService>(TimeslotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
