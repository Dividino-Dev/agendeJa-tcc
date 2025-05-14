import { Test, TestingModule } from '@nestjs/testing';
import { SchedulingsService } from './schedulings.service';
import { PrismaService } from '../prisma/prisma.service';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';


describe('SchedulingsService', () => {
  let service: SchedulingsService;

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
        SchedulingsService,
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

    service = module.get<SchedulingsService>(SchedulingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
