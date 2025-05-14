import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;

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
      controllers: [CategoriesController],
      providers: [
        CategoriesService,
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

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
