import { Test, TestingModule } from '@nestjs/testing';
import { AvataresController } from './avatares.controller';
import { AvataresService } from './avatares.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';

describe('AvataresController', () => {
  let controller: AvataresController;

  const prismaServiceMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const caslAbilityServiceMock = {
    defineAbilitiesFor: jest.fn(),
  };

  const jwtServiceMock = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvataresController],
      providers: [
        AvataresService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
        {
          provide: CaslAbilityService,
          useValue: caslAbilityServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AvataresController>(AvataresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
