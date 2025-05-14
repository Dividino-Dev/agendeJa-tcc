import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { RoleGuard } from './role.guard';

describe('RoleGuard', () => {
  let roleGuard: RoleGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    roleGuard = module.get<RoleGuard>(RoleGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(roleGuard).toBeDefined();
  });

  it('should allow access if no roles are required', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);
    const executionContextMock = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => ({ user: { role: Roles.USER } })),
      })),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;

    expect(roleGuard.canActivate(executionContextMock)).toBe(true);
  });

  it('should allow access if user is ADMIN', () => {
    jest.spyOn(reflector, 'get').mockReturnValue([Roles.USER]);
    const executionContextMock = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => ({ user: { role: Roles.ADMIN } })),
      })),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;

    expect(roleGuard.canActivate(executionContextMock)).toBe(true);
  });

  it('should allow access if user role is in required roles', () => {
    jest.spyOn(reflector, 'get').mockReturnValue([Roles.PROFESSIONAL]);
    const executionContextMock = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => ({ user: { role: Roles.PROFESSIONAL } })),
      })),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;

    expect(roleGuard.canActivate(executionContextMock)).toBe(true);
  });

  it('should deny access if user role is not in required roles', () => {
    jest.spyOn(reflector, 'get').mockReturnValue([Roles.ADMIN]);
    const executionContextMock = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => ({ user: { role: Roles.USER } })),
      })),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;

    expect(roleGuard.canActivate(executionContextMock)).toBe(false);
  });
});
