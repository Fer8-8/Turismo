import { Test, TestingModule } from '@nestjs/testing';
import { GeoStateService } from './state.service';
import { CountryService } from './country.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AppNotFoundException, BusinessException } from '../../core/shared';

const mockCountry = { id: 'c1', name: 'México', iso: 'MX', iso3: 'MEX' };
const mockState = {
  id: 's1',
  name: 'Jalisco',
  abbr: 'JAL',
  country_id: 'c1',
  country: mockCountry,
  created_at: new Date(),
  updated_at: new Date(),
};

describe('GeoStateService', () => {
  let service: GeoStateService;
  let prisma: { state: Record<string, jest.Mock> };
  let countryService: { validateCountryExists: jest.Mock };

  beforeEach(async () => {
    prisma = {
      state: {
        create: jest.fn().mockResolvedValue(mockState),
        findUnique: jest.fn().mockResolvedValue(mockState),
        findMany: jest.fn().mockResolvedValue([mockState]),
        update: jest.fn().mockResolvedValue(mockState),
        delete: jest.fn().mockResolvedValue(mockState),
      },
    };

    countryService = {
      validateCountryExists: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeoStateService,
        { provide: PrismaService, useValue: prisma },
        { provide: CountryService, useValue: countryService },
      ],
    }).compile();

    service = module.get<GeoStateService>(GeoStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── create ──────────────────────────────────────────────

  describe('create', () => {
    it('creates state and validates country', async () => {
      const r = await service.create({ name: 'Jalisco', abbr: 'JAL', country_id: 'c1' });
      expect(countryService.validateCountryExists).toHaveBeenCalledWith('c1');
      expect(r).toEqual(mockState);
    });

    it('creates state without country_id', async () => {
      await service.create({ name: 'Jalisco', abbr: 'JAL' });
      expect(countryService.validateCountryExists).not.toHaveBeenCalled();
    });

    it('propagates error if country does not exist', async () => {
      countryService.validateCountryExists.mockRejectedValue(new AppNotFoundException('Country', 'bad'));
      await expect(
        service.create({ name: 'Jalisco', abbr: 'JAL', country_id: 'bad' }),
      ).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── findById ────────────────────────────────────────────

  describe('findById', () => {
    it('returns state with country', async () => {
      expect(await service.findById('s1')).toEqual(mockState);
    });

    it('throws AppNotFoundException when not found', async () => {
      prisma.state.findUnique.mockResolvedValue(null);
      await expect(service.findById('no')).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── findAll ─────────────────────────────────────────────

  describe('findAll', () => {
    it('returns all states', async () => {
      expect(await service.findAll()).toEqual([mockState]);
    });

    it('filters by countryId', async () => {
      await service.findAll({ countryId: 'c1' });
      const where = prisma.state.findMany.mock.calls[0][0].where;
      expect(where.country_id).toBe('c1');
    });

    it('filters by search', async () => {
      await service.findAll({ search: 'Jal' });
      const where = prisma.state.findMany.mock.calls[0][0].where;
      expect(where.name).toBeDefined();
    });
  });

  // ─── findByCountry ───────────────────────────────────────

  describe('findByCountry', () => {
    it('validates country existence and returns states', async () => {
      const r = await service.findByCountry('c1');
      expect(countryService.validateCountryExists).toHaveBeenCalledWith('c1');
      expect(r).toEqual([mockState]);
    });
  });

  // ─── update ──────────────────────────────────────────────

  describe('update', () => {
    it('updates state successfully', async () => {
      const r = await service.update('s1', { id: 's1', name: 'Jalisco Updated' });
      expect(r).toEqual(mockState);
    });

    it('validates country on country_id change', async () => {
      await service.update('s1', { id: 's1', country_id: 'c2' });
      expect(countryService.validateCountryExists).toHaveBeenCalledWith('c2');
    });

    it('throws when state not found', async () => {
      prisma.state.findUnique.mockResolvedValue(null);
      await expect(service.update('no', { id: 'no', name: 'X' })).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── remove ──────────────────────────────────────────────

  describe('remove', () => {
    it('removes state and returns true', async () => {
      expect(await service.remove('s1')).toBe(true);
    });

    it('throws when state not found', async () => {
      prisma.state.findUnique.mockResolvedValue(null);
      await expect(service.remove('no')).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── validations ─────────────────────────────────────────

  describe('validateStateExists', () => {
    it('returns true when state exists', async () => {
      expect(await service.validateStateExists('s1')).toBe(true);
    });

    it('throws when state does not exist', async () => {
      prisma.state.findUnique.mockResolvedValue(null);
      await expect(service.validateStateExists('no')).rejects.toThrow(AppNotFoundException);
    });
  });

  describe('validateStateBelongsToCountry', () => {
    it('returns true when state belongs to country', async () => {
      expect(await service.validateStateBelongsToCountry('s1', 'c1')).toBe(true);
    });

    it('throws BusinessException when state belongs to different country', async () => {
      prisma.state.findUnique.mockResolvedValue({ ...mockState, country_id: 'c-other' });
      await expect(
        service.validateStateBelongsToCountry('s1', 'c1'),
      ).rejects.toThrow(BusinessException);
    });

    it('throws AppNotFoundException when state does not exist', async () => {
      prisma.state.findUnique.mockResolvedValue(null);
      await expect(
        service.validateStateBelongsToCountry('no', 'c1'),
      ).rejects.toThrow(AppNotFoundException);
    });
  });
});
