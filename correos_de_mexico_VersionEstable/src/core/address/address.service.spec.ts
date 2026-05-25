import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AddressService } from './address.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockState = { id: 'state-1', name: 'Jalisco', abbr: 'JAL', country_id: 'country-mx', created_at: new Date(), updated_at: new Date() };
const mockAddress = {
  id: 'addr-1',
  firstname: 'Juan',
  lastname: 'Pérez',
  address1: 'Av. Reforma 100',
  address2: null,
  city: 'Guadalajara',
  zipcode: '44100',
  phone: '3312345678',
  alternative_phone: null,
  company: null,
  state_name: null,
  state_id: 'state-1',
  country_id: 'country-mx',
  user_id: 'user-1',
  label: 'Casa',
  deleted_at: null,
  created_at: new Date(),
  updated_at: new Date(),
};

describe('AddressService', () => {
  let service: AddressService;
  let prisma: {
    state: { findUnique: jest.Mock };
    country: { findUnique: jest.Mock };
    address: {
      create: jest.Mock;
      findUnique: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      state: { findUnique: jest.fn() },
      country: { findUnique: jest.fn() },
      address: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── createAddress ─────────────────────────────────────────────────────────

  describe('createAddress', () => {
    const input = {
      firstname: 'Juan', lastname: 'Pérez', address1: 'Av. 100', city: 'GDL',
      zipcode: '44100', phone: '331', state_id: 'state-1',
    };

    it('should create an address when state exists', async () => {
      prisma.state.findUnique.mockResolvedValue(mockState);
      prisma.address.create.mockResolvedValue(mockAddress);

      const result = await service.createAddress(input);

      expect(prisma.state.findUnique).toHaveBeenCalledWith({ where: { id: 'state-1' } });
      expect(prisma.address.create).toHaveBeenCalledWith({ data: input });
      expect(result).toEqual(mockAddress);
    });

    it('should throw NotFoundException when state does not exist', async () => {
      prisma.state.findUnique.mockResolvedValue(null);

      await expect(service.createAddress(input)).rejects.toThrow(NotFoundException);
      expect(prisma.address.create).not.toHaveBeenCalled();
    });
  });

  // ─── findAll ───────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should return only non-deleted addresses', async () => {
      prisma.address.findMany.mockResolvedValue([mockAddress]);

      const result = await service.findAll();

      const where = prisma.address.findMany.mock.calls[0][0].where;
      expect(where.deleted_at).toBeNull();
      expect(result).toEqual([mockAddress]);
    });
  });

  // ─── findById ──────────────────────────────────────────────────────────────

  describe('findById', () => {
    it('should return address when found', async () => {
      prisma.address.findUnique.mockResolvedValue(mockAddress);

      expect(await service.findById('addr-1')).toEqual(mockAddress);
    });

    it('should throw NotFoundException when not found', async () => {
      prisma.address.findUnique.mockResolvedValue(null);

      await expect(service.findById('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── findAddressesByUser ────────────────────────────────────────────────────

  describe('findAddressesByUser', () => {
    it('should return active addresses for the user', async () => {
      prisma.address.findMany.mockResolvedValue([mockAddress]);

      await service.findAddressesByUser('user-1');

      const where = prisma.address.findMany.mock.calls[0][0].where;
      expect(where.user_id).toBe('user-1');
      expect(where.deleted_at).toBeNull();
    });
  });

  // ─── updateAddress ─────────────────────────────────────────────────────────

  describe('updateAddress', () => {
    it('should update the address fields', async () => {
      prisma.address.findUnique.mockResolvedValue(mockAddress);
      prisma.address.update.mockResolvedValue({ ...mockAddress, city: 'CDMX' });

      const result = await service.updateAddress({ id: 'addr-1', city: 'CDMX' });

      expect(prisma.address.update).toHaveBeenCalledWith({
        where: { id: 'addr-1' },
        data: { city: 'CDMX' },
      });
      expect(result.city).toBe('CDMX');
    });

    it('should throw NotFoundException when address does not exist', async () => {
      prisma.address.findUnique.mockResolvedValue(null);

      await expect(service.updateAddress({ id: 'bad-id', city: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── softDeleteAddress ─────────────────────────────────────────────────────

  describe('softDeleteAddress', () => {
    it('should set deleted_at to current date', async () => {
      prisma.address.findUnique.mockResolvedValue(mockAddress);
      prisma.address.update.mockResolvedValue({ ...mockAddress, deleted_at: new Date() });

      const before = new Date();
      await service.softDeleteAddress('addr-1');
      const after = new Date();

      const updateCall = prisma.address.update.mock.calls[0][0];
      expect(updateCall.where).toEqual({ id: 'addr-1' });
      const deletedAt: Date = updateCall.data.deleted_at;
      expect(deletedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(deletedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should throw NotFoundException when address does not exist', async () => {
      prisma.address.findUnique.mockResolvedValue(null);

      await expect(service.softDeleteAddress('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── restoreAddress ────────────────────────────────────────────────────────

  describe('restoreAddress', () => {
    it('should clear deleted_at', async () => {
      const deletedAddress = { ...mockAddress, deleted_at: new Date() };
      prisma.address.findUnique.mockResolvedValue(deletedAddress);
      prisma.address.update.mockResolvedValue({ ...deletedAddress, deleted_at: null });

      await service.restoreAddress('addr-1');

      const updateCall = prisma.address.update.mock.calls[0][0];
      expect(updateCall.data.deleted_at).toBeNull();
    });
  });

  // ─── hardDeleteAddress ─────────────────────────────────────────────────────

  describe('hardDeleteAddress', () => {
    it('should permanently delete the address', async () => {
      prisma.address.findUnique.mockResolvedValue(mockAddress);
      prisma.address.delete.mockResolvedValue(mockAddress);

      const result = await service.hardDeleteAddress('addr-1');

      expect(prisma.address.delete).toHaveBeenCalledWith({ where: { id: 'addr-1' } });
      expect(result).toEqual({ success: true });
    });
  });

  // ─── resolve helpers ───────────────────────────────────────────────────────

  describe('getAddressState', () => {
    it('should call prisma.state.findUnique with the stateId', async () => {
      prisma.state.findUnique.mockResolvedValue(mockState);

      const result = await service.getAddressState('state-1');

      expect(prisma.state.findUnique).toHaveBeenCalledWith({ where: { id: 'state-1' } });
      expect(result).toEqual(mockState);
    });
  });
});
