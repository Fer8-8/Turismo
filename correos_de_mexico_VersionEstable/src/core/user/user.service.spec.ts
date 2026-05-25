import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;
  let prisma: {
    cdmUser: {
      findFirst: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      count: jest.Mock;
    };
    address: {
      findFirst: jest.Mock;
    };
    role: {
      findUnique: jest.Mock;
    };
    roleUser: {
      findFirst: jest.Mock;
      create: jest.Mock;
    };
    storeCredit: {
      findMany: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      cdmUser: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      address: {
        findFirst: jest.fn(),
      },
      role: {
        findUnique: jest.fn(),
      },
      roleUser: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
      storeCredit: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('setDefaultShipAddress', () => {
    it('should reject addresses that do not belong to the user', async () => {
      prisma.cdmUser.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.address.findFirst.mockResolvedValue(null);

      await expect(
        service.setDefaultShipAddress('user-1', 'address-2'),
      ).rejects.toThrow(
        new NotFoundException('Dirección no encontrada o no pertenece al usuario'),
      );

      expect(prisma.cdmUser.update).not.toHaveBeenCalled();
    });
  });

  describe('assignRole', () => {
    it('should be idempotent when the user already has the role', async () => {
      prisma.cdmUser.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.role.findUnique.mockResolvedValue({ id: 'role-1', name: 'admin' });
      prisma.roleUser.findFirst.mockResolvedValue({
        id: 'role-user-1',
        user_id: 'user-1',
        role_id: 'role-1',
      });

      await service.assignRole('user-1', 'role-1');

      expect(prisma.roleUser.create).not.toHaveBeenCalled();
    });
  });

  describe('getMinimalProfile', () => {
    it('should map roles and locked state into the minimal profile', async () => {
      const lockedAt = new Date();
      prisma.cdmUser.findUnique.mockResolvedValue({
        id: 'user-1',
        name: 'Samuel',
        email: 'samuel@example.com',
        login: 'samuel',
        locked_at: lockedAt,
        ship_address_id: 'ship-1',
        bill_address_id: 'bill-1',
        roleUsers: [
          { role: { name: 'admin' } },
          { role: null },
          { role: { name: 'ops' } },
        ],
      });

      await expect(service.getMinimalProfile('user-1')).resolves.toEqual({
        id: 'user-1',
        name: 'Samuel',
        email: 'samuel@example.com',
        login: 'samuel',
        locked: true,
        ship_address_id: 'ship-1',
        bill_address_id: 'bill-1',
        roles: ['admin', 'ops'],
      });
    });
  });

  describe('getUserStoreCreditBalance', () => {
    it('should return the available balance after subtracting used amounts', async () => {
      prisma.storeCredit.findMany.mockResolvedValue([
        { amount: '100.50', amount_used: '40.25' },
        { amount: '10', amount_used: '1.5' },
      ]);

      await expect(service.getUserStoreCreditBalance('user-1')).resolves.toBe(68.75);
    });
  });
});