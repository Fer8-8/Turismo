import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppNotFoundException, AppConflictException } from '../../core/shared';
import { CreateTaxCategoryInput } from './dto/create-tax-category.input';
import { UpdateTaxCategoryInput } from './dto/update-tax-category.input';
import { FilterTaxCategoriesInput } from './dto/filters.input';

@Injectable()
export class TaxCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── CRUD ────────────────────────────────────────────────

  async create(input: CreateTaxCategoryInput) {
    if (input.tax_code) {
      const existing = await this.prisma.taxCategory.findFirst({
        where: {
          tax_code: { equals: input.tax_code, mode: 'insensitive' },
          deleted_at: null,
        },
      });
      if (existing) {
        throw new AppConflictException(
          `TaxCategory con tax_code "${input.tax_code}" ya existe`,
        );
      }
    }

    if (input.is_default) {
      await this.clearDefault();
    }

    return this.prisma.taxCategory.create({
      data: {
        name: input.name,
        description: input.description,
        is_default: input.is_default ?? false,
        tax_code: input.tax_code,
      },
    });
  }

  async findById(id: string) {
    const record = await this.prisma.taxCategory.findFirst({
      where: { id, deleted_at: null },
    });
    if (!record) throw new AppNotFoundException('TaxCategory', id);
    return record;
  }

  async findAll(filter: FilterTaxCategoriesInput = {}) {
    const where: Record<string, unknown> = { deleted_at: null };

    if (filter.search) {
      where.OR = [
        { name: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
      ];
    }
    if (filter.tax_code) {
      where.tax_code = { equals: filter.tax_code, mode: 'insensitive' };
    }

    return this.prisma.taxCategory.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async update(id: string, input: UpdateTaxCategoryInput) {
    await this.findById(id);

    if (input.tax_code) {
      const conflict = await this.prisma.taxCategory.findFirst({
        where: {
          tax_code: { equals: input.tax_code, mode: 'insensitive' },
          deleted_at: null,
          NOT: { id },
        },
      });
      if (conflict) {
        throw new AppConflictException(
          `TaxCategory con tax_code "${input.tax_code}" ya existe`,
        );
      }
    }

    if (input.is_default) {
      await this.clearDefault();
    }

    const { id: _id, ...data } = input;
    return this.prisma.taxCategory.update({ where: { id }, data });
  }

  async remove(id: string): Promise<boolean> {
    await this.findById(id);
    await this.prisma.taxCategory.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return true;
  }

  // ─── CONSULTAS ESPECIALES ────────────────────────────────

  async findDefault() {
    return this.prisma.taxCategory.findFirst({
      where: { is_default: true, deleted_at: null },
    });
  }

  async findByTaxCode(code: string) {
    const record = await this.prisma.taxCategory.findFirst({
      where: {
        tax_code: { equals: code, mode: 'insensitive' },
        deleted_at: null,
      },
    });
    if (!record) throw new AppNotFoundException('TaxCategory', code);
    return record;
  }

  // ─── VALIDACIONES ────────────────────────────────────────

  async validateExists(id: string): Promise<boolean> {
    const record = await this.prisma.taxCategory.findFirst({
      where: { id, deleted_at: null },
    });
    if (!record) throw new AppNotFoundException('TaxCategory', id);
    return true;
  }

  // ─── INTERNOS ────────────────────────────────────────────

  private async clearDefault() {
    await this.prisma.taxCategory.updateMany({
      where: { is_default: true },
      data: { is_default: false },
    });
  }
}
