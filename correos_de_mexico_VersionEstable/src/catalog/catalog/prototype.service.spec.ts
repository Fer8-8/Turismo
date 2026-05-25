import { Test, TestingModule } from '@nestjs/testing';
import { PrototypeService } from './prototype.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AppNotFoundException } from '../../core/shared';

const NOW = new Date();
const mockPrototype = {
  id: 'proto-1',
  name: 'Estampilla Estándar',
  created_at: NOW,
  updated_at: NOW,
  propertyPrototypes: [],
  optionTypePrototypes: [],
};

describe('PrototypeService', () => {
  let service: PrototypeService;
  let prisma: {
    prototype: {
      create: jest.Mock;
      findUnique: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    propertyPrototype: {
      findFirst: jest.Mock;
      findMany: jest.Mock;
      create: jest.Mock;
      delete: jest.Mock;
    };
    optionTypePrototype: {
      findFirst: jest.Mock;
      findMany: jest.Mock;
      create: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      prototype: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      propertyPrototype: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
      optionTypePrototype: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrototypeService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PrototypeService>(PrototypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── CRUD ────────────────────────────────────────────────

  describe('create', () => {
    it('should create a prototype', async () => {
      prisma.prototype.create.mockResolvedValue(mockPrototype);

      const result = await service.create({ name: 'Estampilla Estándar' });
      expect(result).toEqual(mockPrototype);
    });
  });

  describe('findById', () => {
    it('should return prototype', async () => {
      prisma.prototype.findUnique.mockResolvedValue(mockPrototype);

      expect((await service.findById('proto-1')).id).toBe('proto-1');
    });

    it('should throw when not found', async () => {
      prisma.prototype.findUnique.mockResolvedValue(null);

      await expect(service.findById('no')).rejects.toThrow(AppNotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all prototypes', async () => {
      prisma.prototype.findMany.mockResolvedValue([mockPrototype]);

      expect(await service.findAll()).toHaveLength(1);
    });
  });

  describe('update', () => {
    it('should update prototype', async () => {
      prisma.prototype.findUnique.mockResolvedValue(mockPrototype);
      prisma.prototype.update.mockResolvedValue({ ...mockPrototype, name: 'Updated' });

      const result = await service.update('proto-1', { id: 'proto-1', name: 'Updated' });
      expect(result.name).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should delete and return true', async () => {
      prisma.prototype.findUnique.mockResolvedValue(mockPrototype);
      prisma.prototype.delete.mockResolvedValue(mockPrototype);

      expect(await service.remove('proto-1')).toBe(true);
    });
  });

  // ─── Prototype ↔ Property ──────────────────────────────

  describe('addPropertyToPrototype', () => {
    it('should create relation', async () => {
      prisma.propertyPrototype.findFirst.mockResolvedValue(null);
      prisma.propertyPrototype.create.mockResolvedValue({
        id: 'pp-1',
        property: { id: 'prop-1' },
      });

      const result = await service.addPropertyToPrototype('proto-1', 'prop-1');
      expect(result.id).toBe('pp-1');
    });

    it('should return existing (idempotent)', async () => {
      const existing = { id: 'pp-1' };
      prisma.propertyPrototype.findFirst.mockResolvedValue(existing);

      const result = await service.addPropertyToPrototype('proto-1', 'prop-1');
      expect(result).toEqual(existing);
      expect(prisma.propertyPrototype.create).not.toHaveBeenCalled();
    });
  });

  describe('removePropertyFromPrototype', () => {
    it('should delete and return true', async () => {
      prisma.propertyPrototype.findFirst.mockResolvedValue({ id: 'pp-1' });
      prisma.propertyPrototype.delete.mockResolvedValue({});

      expect(await service.removePropertyFromPrototype('proto-1', 'prop-1')).toBe(true);
    });

    it('should return false when not exists', async () => {
      prisma.propertyPrototype.findFirst.mockResolvedValue(null);

      expect(await service.removePropertyFromPrototype('proto-1', 'prop-1')).toBe(false);
    });
  });

  describe('getPropertiesByPrototype', () => {
    it('should return properties', async () => {
      prisma.propertyPrototype.findMany.mockResolvedValue([
        { property: { id: 'prop-1', name: 'Color' } },
      ]);

      const result = await service.getPropertiesByPrototype('proto-1');
      expect(result).toHaveLength(1);
      expect(result[0]!.name).toBe('Color');
    });
  });

  describe('isPropertyInPrototype', () => {
    it('should return true when exists', async () => {
      prisma.propertyPrototype.findFirst.mockResolvedValue({ id: 'pp-1' });

      expect(await service.isPropertyInPrototype('proto-1', 'prop-1')).toBe(true);
    });

    it('should return false', async () => {
      prisma.propertyPrototype.findFirst.mockResolvedValue(null);

      expect(await service.isPropertyInPrototype('proto-1', 'prop-1')).toBe(false);
    });
  });

  // ─── Prototype ↔ OptionType ─────────────────────────────

  describe('addOptionTypeToPrototype', () => {
    it('should create relation', async () => {
      prisma.optionTypePrototype.findFirst.mockResolvedValue(null);
      prisma.optionTypePrototype.create.mockResolvedValue({
        id: 'otp-1',
        optionType: { id: 'ot-1' },
      });

      const result = await service.addOptionTypeToPrototype('proto-1', 'ot-1');
      expect(result.id).toBe('otp-1');
    });

    it('should return existing (idempotent)', async () => {
      const existing = { id: 'otp-1' };
      prisma.optionTypePrototype.findFirst.mockResolvedValue(existing);

      expect(await service.addOptionTypeToPrototype('proto-1', 'ot-1')).toEqual(existing);
    });
  });

  describe('removeOptionTypeFromPrototype', () => {
    it('should delete and return true', async () => {
      prisma.optionTypePrototype.findFirst.mockResolvedValue({ id: 'otp-1' });
      prisma.optionTypePrototype.delete.mockResolvedValue({});

      expect(await service.removeOptionTypeFromPrototype('proto-1', 'ot-1')).toBe(true);
    });

    it('should return false', async () => {
      prisma.optionTypePrototype.findFirst.mockResolvedValue(null);

      expect(await service.removeOptionTypeFromPrototype('proto-1', 'ot-1')).toBe(false);
    });
  });

  describe('getOptionTypesByPrototype', () => {
    it('should return option types', async () => {
      prisma.optionTypePrototype.findMany.mockResolvedValue([
        { optionType: { id: 'ot-1', name: 'Tamaño' } },
      ]);

      const result = await service.getOptionTypesByPrototype('proto-1');
      expect(result).toHaveLength(1);
    });
  });

  describe('isOptionTypeInPrototype', () => {
    it('should return true', async () => {
      prisma.optionTypePrototype.findFirst.mockResolvedValue({ id: 'otp-1' });

      expect(await service.isOptionTypeInPrototype('proto-1', 'ot-1')).toBe(true);
    });

    it('should return false', async () => {
      prisma.optionTypePrototype.findFirst.mockResolvedValue(null);

      expect(await service.isOptionTypeInPrototype('proto-1', 'ot-1')).toBe(false);
    });
  });

  describe('validatePrototypeExists', () => {
    it('should return true', async () => {
      prisma.prototype.findUnique.mockResolvedValue({ id: 'proto-1' });

      expect(await service.validatePrototypeExists('proto-1')).toBe(true);
    });

    it('should return false', async () => {
      prisma.prototype.findUnique.mockResolvedValue(null);

      expect(await service.validatePrototypeExists('no')).toBe(false);
    });
  });
});
