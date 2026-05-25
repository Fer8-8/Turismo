import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePrototypeInput } from './dto/create-prototype.input';
import { UpdatePrototypeInput } from './dto/update-prototype.input';
import { AppNotFoundException, AppConflictException } from '../../core/shared';

const PROTOTYPE_INCLUDE = {
  propertyPrototypes: {
    include: { property: true },
  },
  optionTypePrototypes: {
    include: { optionType: true },
  },
} as const;

@Injectable()
export class PrototypeService {
  constructor(private prisma: PrismaService) {}

  // ─── CRUD DE PROTOTIPO ──────────────────────────────────

  async create(input: CreatePrototypeInput) {
    return this.prisma.prototype.create({
      data: { name: input.name },
      include: PROTOTYPE_INCLUDE,
    });
  }

  async findById(id: string) {
    const prototype = await this.prisma.prototype.findUnique({
      where: { id },
      include: PROTOTYPE_INCLUDE,
    });

    if (!prototype) {
      throw new AppNotFoundException('Prototype', id);
    }

    return prototype;
  }

  async findAll() {
    return this.prisma.prototype.findMany({
      include: PROTOTYPE_INCLUDE,
      orderBy: { created_at: 'desc' },
    });
  }

  async update(id: string, input: UpdatePrototypeInput) {
    await this.findById(id);

    const { id: _, ...data } = input;
    return this.prisma.prototype.update({
      where: { id },
      data,
      include: PROTOTYPE_INCLUDE,
    });
  }

  async remove(id: string) {
    await this.findById(id);
    await this.prisma.prototype.delete({ where: { id } });
    return true;
  }

  // ─── PROTOTIPO ↔ PROPIEDAD ─────────────────────────────

  // asociar propiedad a prototipo (idempotente)
  async addPropertyToPrototype(prototypeId: string, propertyId: string) {
    const existing = await this.prisma.propertyPrototype.findFirst({
      where: { prototype_id: prototypeId, property_id: propertyId },
    });
    if (existing) return existing;

    return this.prisma.propertyPrototype.create({
      data: {
        prototype_id: prototypeId,
        property_id: propertyId,
      },
      include: { property: true },
    });
  }

  // desasociar propiedad de prototipo
  async removePropertyFromPrototype(
    prototypeId: string,
    propertyId: string,
  ): Promise<boolean> {
    const relation = await this.prisma.propertyPrototype.findFirst({
      where: { prototype_id: prototypeId, property_id: propertyId },
    });
    if (!relation) return false;

    await this.prisma.propertyPrototype.delete({ where: { id: relation.id } });
    return true;
  }

  // listar propiedades de un prototipo
  async getPropertiesByPrototype(prototypeId: string) {
    const relations = await this.prisma.propertyPrototype.findMany({
      where: { prototype_id: prototypeId },
      include: { property: true },
    });
    return relations.map((r) => r.property).filter(Boolean);
  }

  // verificar si propiedad pertenece a prototipo
  async isPropertyInPrototype(
    prototypeId: string,
    propertyId: string,
  ): Promise<boolean> {
    const relation = await this.prisma.propertyPrototype.findFirst({
      where: { prototype_id: prototypeId, property_id: propertyId },
    });
    return !!relation;
  }

  // ─── PROTOTIPO ↔ OPTION TYPE ───────────────────────────

  // asociar option type a prototipo (idempotente)
  async addOptionTypeToPrototype(prototypeId: string, optionTypeId: string) {
    const existing = await this.prisma.optionTypePrototype.findFirst({
      where: { prototype_id: prototypeId, option_type_id: optionTypeId },
    });
    if (existing) return existing;

    return this.prisma.optionTypePrototype.create({
      data: {
        prototype_id: prototypeId,
        option_type_id: optionTypeId,
      },
      include: { optionType: true },
    });
  }

  // desasociar option type de prototipo
  async removeOptionTypeFromPrototype(
    prototypeId: string,
    optionTypeId: string,
  ): Promise<boolean> {
    const relation = await this.prisma.optionTypePrototype.findFirst({
      where: { prototype_id: prototypeId, option_type_id: optionTypeId },
    });
    if (!relation) return false;

    await this.prisma.optionTypePrototype.delete({ where: { id: relation.id } });
    return true;
  }

  // listar option types de un prototipo
  async getOptionTypesByPrototype(prototypeId: string) {
    const relations = await this.prisma.optionTypePrototype.findMany({
      where: { prototype_id: prototypeId },
      include: { optionType: true },
    });
    return relations.map((r) => r.optionType).filter(Boolean);
  }

  // verificar si option type pertenece a prototipo
  async isOptionTypeInPrototype(
    prototypeId: string,
    optionTypeId: string,
  ): Promise<boolean> {
    const relation = await this.prisma.optionTypePrototype.findFirst({
      where: { prototype_id: prototypeId, option_type_id: optionTypeId },
    });
    return !!relation;
  }

  // ─── VALIDACIONES ──────────────────────────────────────

  async validatePrototypeExists(id: string): Promise<boolean> {
    const p = await this.prisma.prototype.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!p;
  }
}
