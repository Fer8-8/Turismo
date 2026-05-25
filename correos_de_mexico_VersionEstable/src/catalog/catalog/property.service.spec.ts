import { Test, TestingModule } from '@nestjs/testing';
import { PropertyService } from './property.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AppNotFoundException, AppConflictException } from '../../core/shared';

const NOW = new Date();
const mockProperty = {
  id: 'prop-1',
  name: 'Color',
  presentation: 'Color',
  filterable: true,
  filter_param: 'color',
  created_at: NOW,
  updated_at: NOW,
};

const mockProductProperty = {
  id: 'pp-1',
  value: 'Rojo',
  product_id: 'prod-1',
  property_id: 'prop-1',
  position: 0,
  show_property: true,
  filter_param: null,
  created_at: NOW,
  updated_at: NOW,
  property: mockProperty,
};

describe('PropertyService', () => {
  let service: PropertyService;
  let prisma: {
    property: {
      create: jest.Mock;
      findUnique: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    productProperty: {
      findFirst: jest.Mock;
      findUnique: jest.Mock;
      findMany: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      property: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      productProperty: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PropertyService>(PropertyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── Property CRUD ───────────────────────────────────────

  describe('create', () => {
    it('should create a property', async () => {
      prisma.property.create.mockResolvedValue(mockProperty);

      const result = await service.create({ presentation: 'Color', name: 'Color' });
      expect(result).toEqual(mockProperty);
    });
  });

  describe('findById', () => {
    it('should return property', async () => {
      prisma.property.findUnique.mockResolvedValue(mockProperty);

      expect((await service.findById('prop-1')).id).toBe('prop-1');
    });

    it('should throw when not found', async () => {
      prisma.property.findUnique.mockResolvedValue(null);

      await expect(service.findById('no')).rejects.toThrow(AppNotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all properties', async () => {
      prisma.property.findMany.mockResolvedValue([mockProperty]);

      expect(await service.findAll()).toHaveLength(1);
    });
  });

  describe('update', () => {
    it('should update property', async () => {
      prisma.property.findUnique.mockResolvedValue(mockProperty);
      prisma.property.update.mockResolvedValue({ ...mockProperty, name: 'Size' });

      const result = await service.update('prop-1', { id: 'prop-1', name: 'Size' });
      expect(result.name).toBe('Size');
    });
  });

  describe('remove', () => {
    it('should delete and return true', async () => {
      prisma.property.findUnique.mockResolvedValue(mockProperty);
      prisma.property.delete.mockResolvedValue(mockProperty);

      expect(await service.remove('prop-1')).toBe(true);
    });
  });

  describe('getFilterableProperties', () => {
    it('should return only filterable properties', async () => {
      prisma.property.findMany.mockResolvedValue([mockProperty]);

      const result = await service.getFilterableProperties();
      expect(result).toHaveLength(1);
      expect(prisma.property.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { filterable: true } }),
      );
    });
  });

  describe('validatePropertyExists', () => {
    it('should return true when exists', async () => {
      prisma.property.findUnique.mockResolvedValue({ id: 'prop-1' });

      expect(await service.validatePropertyExists('prop-1')).toBe(true);
    });

    it('should return false', async () => {
      prisma.property.findUnique.mockResolvedValue(null);

      expect(await service.validatePropertyExists('no')).toBe(false);
    });
  });

  // ─── Product ↔ Property ─────────────────────────────────

  describe('createProductProperty', () => {
    it('should create product-property association', async () => {
      prisma.productProperty.findFirst.mockResolvedValue(null);
      prisma.productProperty.create.mockResolvedValue(mockProductProperty);

      const result = await service.createProductProperty({
        product_id: 'prod-1',
        property_id: 'prop-1',
        value: 'Rojo',
      });
      expect(result).toEqual(mockProductProperty);
    });

    it('should throw conflict when already associated', async () => {
      prisma.productProperty.findFirst.mockResolvedValue(mockProductProperty);

      await expect(
        service.createProductProperty({
          product_id: 'prod-1',
          property_id: 'prop-1',
        }),
      ).rejects.toThrow(AppConflictException);
    });
  });

  describe('findProductPropertyById', () => {
    it('should return product-property', async () => {
      prisma.productProperty.findUnique.mockResolvedValue(mockProductProperty);

      expect((await service.findProductPropertyById('pp-1')).id).toBe('pp-1');
    });

    it('should throw when not found', async () => {
      prisma.productProperty.findUnique.mockResolvedValue(null);

      await expect(service.findProductPropertyById('no')).rejects.toThrow(
        AppNotFoundException,
      );
    });
  });

  describe('updateProductProperty', () => {
    it('should update value', async () => {
      prisma.productProperty.findUnique.mockResolvedValue(mockProductProperty);
      prisma.productProperty.update.mockResolvedValue({
        ...mockProductProperty,
        value: 'Azul',
      });

      const result = await service.updateProductProperty('pp-1', {
        id: 'pp-1',
        value: 'Azul',
      });
      expect(result.value).toBe('Azul');
    });
  });

  describe('removeProductProperty', () => {
    it('should delete and return true', async () => {
      prisma.productProperty.findUnique.mockResolvedValue(mockProductProperty);
      prisma.productProperty.delete.mockResolvedValue(mockProductProperty);

      expect(await service.removeProductProperty('pp-1')).toBe(true);
    });
  });

  describe('getPropertiesByProduct', () => {
    it('should return properties for product', async () => {
      prisma.productProperty.findMany.mockResolvedValue([mockProductProperty]);

      const result = await service.getPropertiesByProduct('prod-1');
      expect(result).toHaveLength(1);
    });
  });

  describe('getVisiblePropertiesByProduct', () => {
    it('should return only visible properties', async () => {
      prisma.productProperty.findMany.mockResolvedValue([mockProductProperty]);

      const result = await service.getVisiblePropertiesByProduct('prod-1');
      expect(result).toHaveLength(1);
      const where = prisma.productProperty.findMany.mock.calls[0][0].where;
      expect(where.show_property).toBe(true);
    });
  });
});
