import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';


describe('AuthService', () => {
  let service: AuthService;

  const jwtServiceMock = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const prismaServiceMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const caslAbilityServiceMock = {
    defineAbilitiesFor: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
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

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
