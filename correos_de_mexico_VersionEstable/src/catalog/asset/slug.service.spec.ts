import { Test, TestingModule } from '@nestjs/testing';
import { SlugService } from './slug.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AppNotFoundException, AppConflictException } from '../../core/shared';

const mockSlug = {
  id: 'slug-1',
  slug: 'mi-producto',
  sluggable_type: 'product',
  sluggable_id: 'prod-1',
  scope: null,
  is_primary: true,
  created_at: new Date(),
  updated_at: new Date(),
};

describe('SlugService', () => {
  let service: SlugService;
  let prisma: {
    friendlySlug: {
      create: jest.Mock;
      findFirst: jest.Mock;
      findUnique: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      count: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      friendlySlug: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlugService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<SlugService>(SlugService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a slug when it is unique', async () => {
      prisma.friendlySlug.findFirst.mockResolvedValue(null);
      prisma.friendlySlug.create.mockResolvedValue(mockSlug);

      const result = await service.create({
        slug: 'mi-producto',
        sluggable_type: 'product',
        sluggable_id: 'prod-1',
      });

      expect(result).toEqual(mockSlug);
      expect(prisma.friendlySlug.create).toHaveBeenCalled();
    });

    it('should throw ConflictException when slug already exists in scope', async () => {
      prisma.friendlySlug.findFirst.mockResolvedValue(mockSlug);

      await expect(
        service.create({ slug: 'mi-producto', sluggable_type: 'product' }),
      ).rejects.toThrow(AppConflictException);
    });

    it('should default is_primary to true', async () => {
      prisma.friendlySlug.findFirst.mockResolvedValue(null);
      prisma.friendlySlug.create.mockResolvedValue(mockSlug);

      await service.create({ slug: 'nuevo', sluggable_type: 'product' });

      expect(prisma.friendlySlug.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ is_primary: true }),
      });
    });
  });

  describe('findBySlug', () => {
    it('should return the slug record when found', async () => {
      prisma.friendlySlug.findFirst.mockResolvedValue(mockSlug);

      const result = await service.findBySlug('mi-producto');
      expect(result).toEqual(mockSlug);
    });

    it('should throw NotFoundException when slug does not exist', async () => {
      prisma.friendlySlug.findFirst.mockResolvedValue(null);
      await expect(service.findBySlug('no-existe')).rejects.toThrow(AppNotFoundException);
    });
  });

  describe('findBySluggable', () => {
    it('should return all slugs for the entity ordered by is_primary desc', async () => {
      prisma.friendlySlug.findMany.mockResolvedValue([mockSlug]);

      const result = await service.findBySluggable('product', 'prod-1');
      expect(result).toHaveLength(1);
      expect(prisma.friendlySlug.findMany).toHaveBeenCalledWith({
        where: { sluggable_type: 'product', sluggable_id: 'prod-1' },
        orderBy: { is_primary: 'desc' },
      });
    });
  });

  describe('findPrimaryBySluggable', () => {
    it('should return the primary slug for the entity', async () => {
      prisma.friendlySlug.findFirst.mockResolvedValue(mockSlug);

      const result = await service.findPrimaryBySluggable('product', 'prod-1');
      expect(result).toEqual(mockSlug);
      expect(prisma.friendlySlug.findFirst).toHaveBeenCalledWith({
        where: { sluggable_type: 'product', sluggable_id: 'prod-1', is_primary: true },
      });
    });
  });

  describe('update', () => {
    it('should update the slug value when unique', async () => {
      prisma.friendlySlug.findUnique.mockResolvedValue(mockSlug);
      prisma.friendlySlug.findFirst.mockResolvedValue(null); // no conflict
      prisma.friendlySlug.update.mockResolvedValue({ ...mockSlug, slug: 'nuevo-slug' });

      const result = await service.update('slug-1', { id: 'slug-1', slug: 'nuevo-slug' });
      expect(result.slug).toBe('nuevo-slug');
    });

    it('should throw ConflictException when new slug conflicts with another record', async () => {
      prisma.friendlySlug.findUnique.mockResolvedValue(mockSlug);
      prisma.friendlySlug.findFirst.mockResolvedValue({ ...mockSlug, id: 'slug-other' });

      await expect(
        service.update('slug-1', { id: 'slug-1', slug: 'conflicto' }),
      ).rejects.toThrow(AppConflictException);
    });

    it('should throw NotFoundException when slug does not exist', async () => {
      prisma.friendlySlug.findUnique.mockResolvedValue(null);
      await expect(service.update('bad-id', { id: 'bad-id' })).rejects.toThrow(AppNotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete the slug and return true', async () => {
      prisma.friendlySlug.findUnique.mockResolvedValue(mockSlug);
      prisma.friendlySlug.delete.mockResolvedValue(mockSlug);

      expect(await service.delete('slug-1')).toBe(true);
      expect(prisma.friendlySlug.delete).toHaveBeenCalledWith({ where: { id: 'slug-1' } });
    });

    it('should throw NotFoundException when slug not found', async () => {
      prisma.friendlySlug.findUnique.mockResolvedValue(null);
      await expect(service.delete('bad-id')).rejects.toThrow(AppNotFoundException);
    });
  });

  describe('slugExists', () => {
    it('should return true when slug count > 0', async () => {
      prisma.friendlySlug.count.mockResolvedValue(1);
      expect(await service.slugExists('mi-producto')).toBe(true);
    });

    it('should return false when slug count === 0', async () => {
      prisma.friendlySlug.count.mockResolvedValue(0);
      expect(await service.slugExists('libre')).toBe(false);
    });
  });
});
