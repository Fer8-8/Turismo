import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: {
    user: {
      findUnique: jest.Mock;
    };
  };

  const expiredDate = new Date(Date.now() - 60 * 60 * 1000);

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkUserAccessibility', () => {
    it('should return user_not_found when the user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.checkUserAccessibility('missing-user')).resolves.toEqual({
        accessible: false,
        reason: 'user_not_found',
      });
    });

    it('should return inaccessible when the user is banned without expiration', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        banned: true,
        banReason: 'fraud_review',
        banExpires: null,
      });

      await expect(service.checkUserAccessibility('user-1')).resolves.toEqual({
        accessible: false,
        reason: 'fraud_review',
      });
    });

    it('should treat expired bans as accessible again', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        banned: true,
        banReason: 'temporary_ban',
        banExpires: expiredDate,
      });

      await expect(service.checkUserAccessibility('user-1')).resolves.toEqual({
        accessible: true,
      });
    });

    it('should return accessible for a normal active user', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        banned: false,
        banReason: null,
        banExpires: null,
      });

      await expect(service.checkUserAccessibility('user-1')).resolves.toEqual({
        accessible: true,
      });
    });
  });
});