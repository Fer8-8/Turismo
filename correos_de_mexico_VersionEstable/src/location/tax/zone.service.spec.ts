import { Test, TestingModule } from '@nestjs/testing';
import { ZoneService } from './zone.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AppNotFoundException } from '../../core/shared';

const mockZone = {
  id: 'z1',
  name: 'MX Zone',
  description: 'México zona fiscal',
  default_tax: false,
  zone_members_count: 2,
  kind: 'state',
  created_at: new Date(),
  updated_at: new Date(),
  zoneMembers: [],
};

const mockMember = {
  id: 'zm1',
  zone_id: 'z1',
  zoneable_type: 'GeoState',
  zoneable_id: 's1',
  created_at: new Date(),
  updated_at: new Date(),
};

describe('ZoneService', () => {
  let service: ZoneService;
  let prisma: {
    zone: Record<string, jest.Mock>;
    zoneMember: Record<string, jest.Mock>;
  };

  beforeEach(async () => {
    prisma = {
      zone: {
        create: jest.fn().mockResolvedValue(mockZone),
        findUnique: jest.fn().mockResolvedValue(mockZone),
        findFirst: jest.fn().mockResolvedValue(mockZone),
        findMany: jest.fn().mockResolvedValue([mockZone]),
        update: jest.fn().mockResolvedValue(mockZone),
        delete: jest.fn().mockResolvedValue(mockZone),
      },
      zoneMember: {
        create: jest.fn().mockResolvedValue(mockMember),
        findUnique: jest.fn().mockResolvedValue(mockMember),
        findFirst: jest.fn().mockResolvedValue(null),
        findMany: jest.fn().mockResolvedValue([mockMember]),
        delete: jest.fn().mockResolvedValue(mockMember),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ZoneService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ZoneService>(ZoneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── Zone CRUD ───────────────────────────────────────────

  describe('create', () => {
    it('creates a zone', async () => {
      const r = await service.create({ name: 'MX Zone' });
      expect(r).toEqual(mockZone);
      expect(prisma.zone.create).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('returns zone when found', async () => {
      expect(await service.findById('z1')).toEqual(mockZone);
    });

    it('throws AppNotFoundException when not found', async () => {
      prisma.zone.findUnique.mockResolvedValue(null);
      await expect(service.findById('no')).rejects.toThrow(AppNotFoundException);
    });
  });

  describe('findAll', () => {
    it('returns zones without filter', async () => {
      expect(await service.findAll()).toEqual([mockZone]);
    });

    it('filters by search', async () => {
      await service.findAll({ search: 'MX' });
      const where = prisma.zone.findMany.mock.calls[0][0].where;
      expect(where.OR).toBeDefined();
    });

    it('filters by kind', async () => {
      await service.findAll({ kind: 'state' });
      const where = prisma.zone.findMany.mock.calls[0][0].where;
      expect(where.kind).toBe('state');
    });
  });

  describe('update', () => {
    it('updates zone', async () => {
      const r = await service.update('z1', { id: 'z1', name: 'Updated' });
      expect(r).toEqual(mockZone);
    });

    it('throws if zone not found', async () => {
      prisma.zone.findUnique.mockResolvedValue(null);
      await expect(
        service.update('no', { id: 'no', name: 'X' }),
      ).rejects.toThrow(AppNotFoundException);
    });
  });

  describe('remove', () => {
    it('deletes zone and returns true', async () => {
      expect(await service.remove('z1')).toBe(true);
      expect(prisma.zone.delete).toHaveBeenCalledWith({ where: { id: 'z1' } });
    });

    it('throws if zone not found', async () => {
      prisma.zone.findUnique.mockResolvedValue(null);
      await expect(service.remove('no')).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── Zone Members ───────────────────────────────────────

  describe('addMember', () => {
    it('adds member and increments counter', async () => {
      const r = await service.addMember({
        zone_id: 'z1',
        zoneable_type: 'GeoState',
        zoneable_id: 's1',
      });
      expect(r).toEqual(mockMember);
      expect(prisma.zoneMember.create).toHaveBeenCalled();
      expect(prisma.zone.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'z1' },
          data: { zone_members_count: 3 },
        }),
      );
    });
  });

  describe('removeMember', () => {
    it('removes member and decrements counter', async () => {
      expect(await service.removeMember('zm1')).toBe(true);
      expect(prisma.zoneMember.delete).toHaveBeenCalledWith({ where: { id: 'zm1' } });
    });

    it('throws if member not found', async () => {
      prisma.zoneMember.findUnique.mockResolvedValue(null);
      await expect(service.removeMember('no')).rejects.toThrow(AppNotFoundException);
    });

    it('skips counter update when member has no zone_id', async () => {
      prisma.zoneMember.findUnique.mockResolvedValue({ ...mockMember, zone_id: null });
      expect(await service.removeMember('zm1')).toBe(true);
      expect(prisma.zone.findUnique).not.toHaveBeenCalled();
      expect(prisma.zone.update).not.toHaveBeenCalled();
    });

    it('floors zone_members_count at 0 when already zero', async () => {
      prisma.zoneMember.findUnique.mockResolvedValue(mockMember);
      prisma.zone.findUnique.mockResolvedValue({ ...mockZone, zone_members_count: 0 });
      await service.removeMember('zm1');
      expect(prisma.zone.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'z1' },
          data: { zone_members_count: 0 },
        }),
      );
    });
  });

  describe('getMembersByZone', () => {
    it('returns members for a zone', async () => {
      expect(await service.getMembersByZone('z1')).toEqual([mockMember]);
    });

    it('throws if zone not found', async () => {
      prisma.zone.findUnique.mockResolvedValue(null);
      await expect(service.getMembersByZone('no')).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── resolveZoneForState ────────────────────────────────

  describe('resolveZoneForState', () => {
    it('returns zone via zoneMember match', async () => {
      prisma.zoneMember.findFirst.mockResolvedValue({
        ...mockMember,
        zone: mockZone,
      });
      const r = await service.resolveZoneForState('s1');
      expect(r).toEqual(mockZone);
    });

    it('falls back to default zone if no member match', async () => {
      prisma.zoneMember.findFirst.mockResolvedValue(null);
      prisma.zone.findFirst.mockResolvedValue({ ...mockZone, default_tax: true });
      const r = await service.resolveZoneForState('s-unknown');
      expect(r).toEqual(expect.objectContaining({ default_tax: true }));
    });

    it('returns null if no match and no default', async () => {
      prisma.zoneMember.findFirst.mockResolvedValue(null);
      prisma.zone.findFirst.mockResolvedValue(null);
      const r = await service.resolveZoneForState('s-x');
      expect(r).toBeNull();
    });
  });

  // ─── validateExists ──────────────────────────────────────

  describe('validateExists', () => {
    it('returns true when zone exists', async () => {
      expect(await service.validateExists('z1')).toBe(true);
    });

    it('throws when zone does not exist', async () => {
      prisma.zone.findUnique.mockResolvedValue(null);
      await expect(service.validateExists('no')).rejects.toThrow(AppNotFoundException);
    });
  });
});
