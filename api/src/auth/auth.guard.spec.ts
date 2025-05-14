import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;
  let prismaService: PrismaService;
  let abilityService: CaslAbilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        { provide: JwtService, useValue: { verify: jest.fn() } },
        { provide: PrismaService, useValue: { user: { findUnique: jest.fn() } } },
        { provide: CaslAbilityService, useValue: { createForUser: jest.fn() } },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
    prismaService = module.get<PrismaService>(PrismaService);
    abilityService = module.get<CaslAbilityService>(CaslAbilityService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
