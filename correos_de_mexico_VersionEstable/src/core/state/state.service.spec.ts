import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { StateService } from './state.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockState = { id: 'state-1', name: 'Jalisco', abbr: 'JAL', country_id: 'country-mx', updated_at: new Date(), created_at: new Date() };
const mockCountry = { id: 'country-mx', name: 'México', iso: 'MX', iso3: 'MEX', iso_name: 'MEXICO', numcode: 484, states_required: true, zipcode_required: true, created_at: new Date(), updated_at: new Date() };

describe('StateService', () => {
  let service: StateService;
  let prisma: {
    state: { create: jest.Mock; findUnique: jest.Mock; findMany: jest.Mock; update: jest.Mock; delete: jest.Mock };
    country: { findUnique: jest.Mock; findMany: jest.Mock; findFirst: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      state: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      country: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StateService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<StateService>(StateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── create ────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('should create a state with the given input', async () => {
      prisma.state.create.mockResolvedValue(mockState);
      const input = { name: 'Jalisco', abbr: 'JAL', country_id: 'country-mx' };

      const result = await service.create(input);

      expect(prisma.state.create).toHaveBeenCalledWith({ data: input });
      expect(result).toEqual(mockState);
    });
  });

  // ─── findAll ───────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should return all states ordered by name', async () => {
      prisma.state.findMany.mockResolvedValue([mockState]);

      const result = await service.findAll();

      expect(prisma.state.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { name: 'asc' },
      });
      expect(result).toHaveLength(1);
    });

    it('should filter by countryId when provided', async () => {
      prisma.state.findMany.mockResolvedValue([mockState]);

      await service.findAll({ countryId: 'country-mx' });

      const where = prisma.state.findMany.mock.calls[0][0].where;
      expect(where.country_id).toBe('country-mx');
    });

    it('should filter by search term when provided', async () => {
      prisma.state.findMany.mockResolvedValue([mockState]);

      await service.findAll({ search: 'jal' });

      const where = prisma.state.findMany.mock.calls[0][0].where;
      expect(where.name).toEqual({ contains: 'jal', mode: 'insensitive' });
    });
  });

  // ─── findById ──────────────────────────────────────────────────────────────

  describe('findById', () => {
    it('should return the state when found', async () => {
      prisma.state.findUnique.mockResolvedValue(mockState);

      expect(await service.findById('state-1')).toEqual(mockState);
    });

    it('should throw NotFoundException when not found', async () => {
      prisma.state.findUnique.mockResolvedValue(null);

      await expect(service.findById('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── getStatesByCountry ────────────────────────────────────────────────────

  describe('getStatesByCountry', () => {
    it('should return states filtered by countryId, ordered by name', async () => {
      prisma.state.findMany.mockResolvedValue([mockState]);

      const result = await service.getStatesByCountry('country-mx');

      expect(prisma.state.findMany).toHaveBeenCalledWith({
        where: { country_id: 'country-mx' },
        orderBy: { name: 'asc' },
      });
      expect(result).toEqual([mockState]);
    });
  });

  // ─── update ────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('should update a state and return the updated record', async () => {
      prisma.state.findUnique.mockResolvedValue(mockState);
      prisma.state.update.mockResolvedValue({ ...mockState, abbr: 'JAL2' });

      const result = await service.update({ id: 'state-1', abbr: 'JAL2' });

      expect(prisma.state.update).toHaveBeenCalledWith({
        where: { id: 'state-1' },
        data: { abbr: 'JAL2' },
      });
      expect(result.abbr).toBe('JAL2');
    });

    it('should throw NotFoundException when state does not exist', async () => {
      prisma.state.findUnique.mockResolvedValue(null);

      await expect(service.update({ id: 'bad-id', abbr: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── Country methods ───────────────────────────────────────────────────────

  describe('findAllCountries', () => {
    it('should return all countries ordered by name', async () => {
      prisma.country.findMany.mockResolvedValue([mockCountry]);

      const result = await service.findAllCountries();

      expect(prisma.country.findMany).toHaveBeenCalledWith({ orderBy: { name: 'asc' } });
      expect(result).toEqual([mockCountry]);
    });
  });

  describe('findCountryById', () => {
    it('should return country when found', async () => {
      prisma.country.findUnique.mockResolvedValue(mockCountry);

      expect(await service.findCountryById('country-mx')).toEqual(mockCountry);
    });

    it('should throw NotFoundException when country not found', async () => {
      prisma.country.findUnique.mockResolvedValue(null);

      await expect(service.findCountryById('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findCountryByIso', () => {
    it('should do case-insensitive search by ISO code', async () => {
      prisma.country.findFirst.mockResolvedValue(mockCountry);

      await service.findCountryByIso('mx');

      expect(prisma.country.findFirst).toHaveBeenCalledWith({
        where: { iso: { equals: 'mx', mode: 'insensitive' } },
      });
    });

    it('should return null when no match', async () => {
      prisma.country.findFirst.mockResolvedValue(null);

      expect(await service.findCountryByIso('ZZ')).toBeNull();
    });
  });
});
