import { Test, TestingModule } from '@nestjs/testing';
import { CountryService } from './country.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AppNotFoundException, AppConflictException } from '../../core/shared';

const mockCountry = {
  id: 'c1',
  iso_name: 'Mexico',
  iso: 'MX',
  iso3: 'MEX',
  name: 'México',
  numcode: 484,
  states_required: true,
  zipcode_required: true,
  created_at: new Date(),
  updated_at: new Date(),
};

describe('CountryService', () => {
  let service: CountryService;
  let prisma: { country: Record<string, jest.Mock> };

  beforeEach(async () => {
    prisma = {
      country: {
        create: jest.fn().mockResolvedValue(mockCountry),
        findUnique: jest.fn().mockResolvedValue(mockCountry),
        findFirst: jest.fn().mockResolvedValue(null),
        findMany: jest.fn().mockResolvedValue([mockCountry]),
        update: jest.fn().mockResolvedValue(mockCountry),
        delete: jest.fn().mockResolvedValue(mockCountry),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountryService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CountryService>(CountryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── create ──────────────────────────────────────────────

  describe('create', () => {
    it('creates a country when ISO is unique', async () => {
      prisma.country.findFirst.mockResolvedValue(null);
      const r = await service.create({
        iso_name: 'Mexico',
        iso: 'MX',
        iso3: 'MEX',
        name: 'México',
      });
      expect(r).toEqual(mockCountry);
      expect(prisma.country.create).toHaveBeenCalled();
    });

    it('throws AppConflictException if ISO already exists', async () => {
      prisma.country.findFirst.mockResolvedValue(mockCountry);
      await expect(
        service.create({ iso_name: 'Mexico', iso: 'MX', iso3: 'MEX', name: 'México' }),
      ).rejects.toThrow(AppConflictException);
    });

    it('normalizes ISO to uppercase', async () => {
      prisma.country.findFirst.mockResolvedValue(null);
      await service.create({ iso_name: 'Mexico', iso: 'mx', iso3: 'mex', name: 'México' });
      const createCall = prisma.country.create.mock.calls[0][0];
      expect(createCall.data.iso).toBe('MX');
      expect(createCall.data.iso3).toBe('MEX');
    });

    it('applies business defaults: states_required=false, zipcode_required=true when omitted', async () => {
      prisma.country.findFirst.mockResolvedValue(null);
      await service.create({ iso_name: 'Testland', iso: 'TT', iso3: 'TST', name: 'Testland' });
      const { data } = prisma.country.create.mock.calls[0][0];
      expect(data.states_required).toBe(false);
      expect(data.zipcode_required).toBe(true);
    });
  });

  // ─── findById ────────────────────────────────────────────

  describe('findById', () => {
    it('returns country when found', async () => {
      expect(await service.findById('c1')).toEqual(mockCountry);
    });

    it('throws AppNotFoundException when not found', async () => {
      prisma.country.findUnique.mockResolvedValue(null);
      await expect(service.findById('not-exist')).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── findByIso ───────────────────────────────────────────

  describe('findByIso', () => {
    it('returns country by ISO', async () => {
      prisma.country.findFirst.mockResolvedValue(mockCountry);
      expect(await service.findByIso('MX')).toEqual(mockCountry);
    });

    it('throws AppNotFoundException when not found', async () => {
      prisma.country.findFirst.mockResolvedValue(null);
      await expect(service.findByIso('XX')).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── findByIso3 ──────────────────────────────────────────

  describe('findByIso3', () => {
    it('returns country by ISO3', async () => {
      prisma.country.findFirst.mockResolvedValue(mockCountry);
      expect(await service.findByIso3('MEX')).toEqual(mockCountry);
    });

    it('throws when not found', async () => {
      prisma.country.findFirst.mockResolvedValue(null);
      await expect(service.findByIso3('ZZZ')).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── findAll ─────────────────────────────────────────────

  describe('findAll', () => {
    it('returns all countries without filter', async () => {
      expect(await service.findAll()).toEqual([mockCountry]);
    });

    it('filters by ISO', async () => {
      await service.findAll({ iso: 'MX' });
      const whereArg = prisma.country.findMany.mock.calls[0][0].where;
      expect(whereArg.iso).toBeDefined();
    });

    it('filters by search term', async () => {
      await service.findAll({ search: 'México' });
      const whereArg = prisma.country.findMany.mock.calls[0][0].where;
      expect(whereArg.OR).toBeDefined();
    });
  });

  // ─── update ──────────────────────────────────────────────

  describe('update', () => {
    it('updates country successfully', async () => {
      const r = await service.update('c1', { id: 'c1', name: 'México Updated' });
      expect(r).toEqual(mockCountry);
    });

    it('throws AppConflictException if ISO conflicts with another country', async () => {
      prisma.country.findFirst.mockResolvedValue({ id: 'c-other' });
      await expect(
        service.update('c1', { id: 'c1', iso: 'CA' }),
      ).rejects.toThrow(AppConflictException);
    });
  });

  // ─── remove ──────────────────────────────────────────────

  describe('remove', () => {
    it('removes country and returns true', async () => {
      expect(await service.remove('c1')).toBe(true);
    });

    it('throws AppNotFoundException if country does not exist', async () => {
      prisma.country.findUnique.mockResolvedValue(null);
      await expect(service.remove('no-exist')).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── validations ─────────────────────────────────────────

  describe('validateCountryExists', () => {
    it('returns true when country exists', async () => {
      expect(await service.validateCountryExists('c1')).toBe(true);
    });

    it('throws when country does not exist', async () => {
      prisma.country.findUnique.mockResolvedValue(null);
      await expect(service.validateCountryExists('no')).rejects.toThrow(AppNotFoundException);
    });
  });

  describe('validateCountryExistsByIso', () => {
    it('returns true when country exists by ISO', async () => {
      prisma.country.findFirst.mockResolvedValue(mockCountry);
      expect(await service.validateCountryExistsByIso('MX')).toBe(true);
    });

    it('throws when country not found by ISO', async () => {
      prisma.country.findFirst.mockResolvedValue(null);
      await expect(service.validateCountryExistsByIso('XX')).rejects.toThrow(AppNotFoundException);
    });
  });
});
