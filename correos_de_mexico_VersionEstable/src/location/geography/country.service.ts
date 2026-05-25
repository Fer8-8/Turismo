import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppNotFoundException, AppConflictException } from '../../core/shared';
import { CreateCountryInput } from './dto/create-country.input';
import { UpdateCountryInput } from './dto/update-country.input';
import { FilterCountriesInput } from './dto/filter-countries.input';

@Injectable()
export class CountryService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── CRUD ────────────────────────────────────────────────

  async create(input: CreateCountryInput) {
    const existing = await this.prisma.country.findFirst({
      where: { iso: { equals: input.iso, mode: 'insensitive' } },
    });
    if (existing) {
      throw new AppConflictException(`País con ISO "${input.iso}" ya existe`);
    }

    return this.prisma.country.create({
      data: {
        iso_name: input.iso_name,
        iso: input.iso.toUpperCase(),
        iso3: input.iso3.toUpperCase(),
        name: input.name,
        numcode: input.numcode ?? 0,
        states_required: input.states_required ?? false,
        zipcode_required: input.zipcode_required ?? true,
      },
    });
  }

  async findById(id: string) {
    const country = await this.prisma.country.findUnique({ where: { id } });
    if (!country) throw new AppNotFoundException('Country', id);
    return country;
  }

  async findByIso(iso: string) {
    const country = await this.prisma.country.findFirst({
      where: { iso: { equals: iso, mode: 'insensitive' } },
    });
    if (!country) throw new AppNotFoundException('Country', iso);
    return country;
  }

  async findByIso3(iso3: string) {
    const country = await this.prisma.country.findFirst({
      where: { iso3: { equals: iso3, mode: 'insensitive' } },
    });
    if (!country) throw new AppNotFoundException('Country', iso3);
    return country;
  }

  async findAll(filter: FilterCountriesInput = {}) {
    const where: Record<string, unknown> = {};

    if (filter.iso) {
      where.iso = { equals: filter.iso, mode: 'insensitive' };
    }
    if (filter.search) {
      where.OR = [
        { name: { contains: filter.search, mode: 'insensitive' } },
        { iso_name: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.country.findMany({ where, orderBy: { name: 'asc' } });
  }

  async update(id: string, input: UpdateCountryInput) {
    await this.findById(id);

    if (input.iso) {
      const conflict = await this.prisma.country.findFirst({
        where: {
          iso: { equals: input.iso, mode: 'insensitive' },
          NOT: { id },
        },
      });
      if (conflict) {
        throw new AppConflictException(`País con ISO "${input.iso}" ya existe`);
      }
    }

    const { id: _id, ...data } = input;
    if (data.iso) data.iso = data.iso.toUpperCase();
    if (data.iso3) data.iso3 = data.iso3.toUpperCase();

    return this.prisma.country.update({ where: { id }, data });
  }

  async remove(id: string): Promise<boolean> {
    await this.findById(id);
    await this.prisma.country.delete({ where: { id } });
    return true;
  }

  // ─── VALIDACIONES ────────────────────────────────────────

  async validateCountryExists(id: string): Promise<boolean> {
    const country = await this.prisma.country.findUnique({ where: { id } });
    if (!country) throw new AppNotFoundException('Country', id);
    return true;
  }

  async validateCountryExistsByIso(iso: string): Promise<boolean> {
    const country = await this.prisma.country.findFirst({
      where: { iso: { equals: iso, mode: 'insensitive' } },
    });
    if (!country) throw new AppNotFoundException('Country', iso);
    return true;
  }
}
