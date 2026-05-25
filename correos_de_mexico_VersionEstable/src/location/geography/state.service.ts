import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppNotFoundException, BusinessException } from '../../core/shared';
import { CountryService } from './country.service';
import { CreateGeoStateInput } from './dto/create-state.input';
import { UpdateGeoStateInput } from './dto/update-state.input';
import { FilterGeoStatesInput } from './dto/filter-states.input';

const STATE_INCLUDE = { country: true } as const;

@Injectable()
export class GeoStateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly countryService: CountryService,
  ) {}

  // ─── CRUD ────────────────────────────────────────────────

  async create(input: CreateGeoStateInput) {
    if (input.country_id) {
      await this.countryService.validateCountryExists(input.country_id);
    }

    return this.prisma.state.create({
      data: {
        name: input.name,
        abbr: input.abbr,
        country_id: input.country_id,
      },
      include: STATE_INCLUDE,
    });
  }

  async findById(id: string) {
    const state = await this.prisma.state.findUnique({
      where: { id },
      include: STATE_INCLUDE,
    });
    if (!state) throw new AppNotFoundException('State', id);
    return state;
  }

  async findAll(filter: FilterGeoStatesInput = {}) {
    const where: Record<string, unknown> = {};

    if (filter.countryId) where.country_id = filter.countryId;
    if (filter.search) {
      where.name = { contains: filter.search, mode: 'insensitive' };
    }

    return this.prisma.state.findMany({
      where,
      include: STATE_INCLUDE,
      orderBy: { name: 'asc' },
    });
  }

  async findByCountry(countryId: string) {
    await this.countryService.validateCountryExists(countryId);

    return this.prisma.state.findMany({
      where: { country_id: countryId },
      include: STATE_INCLUDE,
      orderBy: { name: 'asc' },
    });
  }

  async update(id: string, input: UpdateGeoStateInput) {
    await this.findById(id);

    if (input.country_id) {
      await this.countryService.validateCountryExists(input.country_id);
    }

    const { id: _id, ...data } = input;
    return this.prisma.state.update({
      where: { id },
      data,
      include: STATE_INCLUDE,
    });
  }

  async remove(id: string): Promise<boolean> {
    await this.findById(id);
    await this.prisma.state.delete({ where: { id } });
    return true;
  }

  // ─── VALIDACIONES ────────────────────────────────────────

  async validateStateExists(id: string): Promise<boolean> {
    const state = await this.prisma.state.findUnique({ where: { id } });
    if (!state) throw new AppNotFoundException('State', id);
    return true;
  }

  async validateStateBelongsToCountry(
    stateId: string,
    countryId: string,
  ): Promise<boolean> {
    const state = await this.findById(stateId);
    if (state.country_id !== countryId) {
      throw new BusinessException(
        `El estado "${stateId}" no pertenece al país "${countryId}"`,
      );
    }
    return true;
  }
}
