import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppNotFoundException } from '../../core/shared';
import { CreateTaxRateInput } from './dto/create-tax-rate.input';
import { UpdateTaxRateInput } from './dto/update-tax-rate.input';
import { FilterTaxRatesInput } from './dto/filters.input';

@Injectable()
export class TaxRateService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly defaultInclude = {
    zone: true,
    taxCategory: true,
  };

  // ─── CRUD ────────────────────────────────────────────────

  async create(input: CreateTaxRateInput) {
    return this.prisma.taxRate.create({
      data: {
        amount: input.amount,
        name: input.name,
        zone_id: input.zone_id,
        tax_category_id: input.tax_category_id,
        included_in_price: input.included_in_price ?? false,
        show_rate_in_label: input.show_rate_in_label ?? true,
      },
      include: this.defaultInclude,
    });
  }

  async findById(id: string) {
    const record = await this.prisma.taxRate.findFirst({
      where: { id, deleted_at: null },
      include: this.defaultInclude,
    });
    if (!record) throw new AppNotFoundException('TaxRate', id);
    return record;
  }

  async findAll(filter: FilterTaxRatesInput = {}) {
    const where: Record<string, unknown> = { deleted_at: null };

    if (filter.zone_id) where.zone_id = filter.zone_id;
    if (filter.tax_category_id) where.tax_category_id = filter.tax_category_id;
    if (filter.search) {
      where.name = { contains: filter.search, mode: 'insensitive' };
    }

    return this.prisma.taxRate.findMany({
      where,
      include: this.defaultInclude,
      orderBy: { name: 'asc' },
    });
  }

  async update(id: string, input: UpdateTaxRateInput) {
    await this.findById(id);
    const { id: _id, ...data } = input;
    return this.prisma.taxRate.update({
      where: { id },
      data,
      include: this.defaultInclude,
    });
  }

  async remove(id: string): Promise<boolean> {
    await this.findById(id);
    await this.prisma.taxRate.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return true;
  }

  // ─── CONSULTAS ESPECIALES ────────────────────────────────

  async findByZone(zoneId: string) {
    return this.prisma.taxRate.findMany({
      where: { zone_id: zoneId, deleted_at: null },
      include: this.defaultInclude,
      orderBy: { name: 'asc' },
    });
  }

  async findByCategory(categoryId: string) {
    return this.prisma.taxRate.findMany({
      where: { tax_category_id: categoryId, deleted_at: null },
      include: this.defaultInclude,
      orderBy: { name: 'asc' },
    });
  }

  async findByCategoryAndZone(categoryId: string, zoneId: string) {
    return this.prisma.taxRate.findMany({
      where: {
        tax_category_id: categoryId,
        zone_id: zoneId,
        deleted_at: null,
      },
      include: this.defaultInclude,
      orderBy: { name: 'asc' },
    });
  }

  // ─── VALIDACIONES ────────────────────────────────────────

  async validateExists(id: string): Promise<boolean> {
    const record = await this.prisma.taxRate.findFirst({
      where: { id, deleted_at: null },
    });
    if (!record) throw new AppNotFoundException('TaxRate', id);
    return true;
  }
}
