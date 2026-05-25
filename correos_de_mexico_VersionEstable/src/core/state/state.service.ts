import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStateInput } from './dto/create-state.input';
import { UpdateStateInput } from './dto/update-state.input';
import { FilterStatesInput } from './dto/filter-states.input';

// maneja estados y países para direcciones y ubicaciones
@Injectable()
export class StateService {
  constructor(private readonly prisma: PrismaService) {}

  // crea operaciones de estados y países
  async create(input: CreateStateInput) {
    return this.prisma.state.create({ data: input });
  }

  // busca estados con filtros opcionales por país o búsqueda
  async findAll(filter?: FilterStatesInput) {
    const where: Record<string, any> = {};

    if (filter?.countryId) where.country_id = filter.countryId;
    if (filter?.search) {
      where.name = { contains: filter.search, mode: 'insensitive' };
    }

    return this.prisma.state.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  // busca un estado por su id
  async findById(id: string) {
    const state = await this.prisma.state.findUnique({ where: { id } });
    if (!state) throw new NotFoundException(`Estado ${id} no encontrado`);
    return state;
  }

  // obtiene todos los estados de un país en orden alfabético
  async getStatesByCountry(countryId: string) {
    return this.prisma.state.findMany({
      where: { country_id: countryId },
      orderBy: { name: 'asc' },
    });
  }

  // actualiza un estado existente
  async update(input: UpdateStateInput) {
    await this.findById(input.id);
    const { id, ...data } = input;
    return this.prisma.state.update({ where: { id }, data });
  }

  // elimina un estado de la base
  async remove(id: string) {
    await this.findById(id);
    await this.prisma.state.delete({ where: { id } });
    return { success: true };
  }

  // obtiene todos los países en orden alfabético
  async findAllCountries() {
    return this.prisma.country.findMany({ orderBy: { name: 'asc' } });
  }

  // busca un país por su id única
  async findCountryById(id: string) {
    const country = await this.prisma.country.findUnique({ where: { id } });
    if (!country) throw new NotFoundException(`País ${id} no encontrado`);
    return country;
  }

  // busca un país por su código iso de dos letras
  async findCountryByIso(iso: string) {
    return this.prisma.country.findFirst({
      where: { iso: { equals: iso, mode: 'insensitive' } },
    });
  }

  // obtiene el país de un estado para graphql
  async getStateCountry(countryId: string) {
    return this.prisma.country.findUnique({ where: { id: countryId } });
  }
}

