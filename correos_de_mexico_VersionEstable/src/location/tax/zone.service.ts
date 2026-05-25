import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppNotFoundException } from '../../core/shared';
import { CreateZoneInput } from './dto/create-zone.input';
import { UpdateZoneInput } from './dto/update-zone.input';
import { CreateZoneMemberInput } from './dto/create-zone-member.input';
import { FilterZonesInput } from './dto/filters.input';

@Injectable()
export class ZoneService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── crud de zonas ───────────────────────────────────────────

  async create(input: CreateZoneInput) {
    return this.prisma.zone.create({
      data: {
        name: input.name,
        description: input.description,
        default_tax: input.default_tax ?? false,
        kind: input.kind ?? 'state',
      },
    });
  }

  async findById(id: string) {
    const zone = await this.prisma.zone.findUnique({
      where: { id },
      include: { zoneMembers: true },
    });
    if (!zone) throw new AppNotFoundException('Zone', id);
    return zone;
  }

  async findAll(filter: FilterZonesInput = {}) {
    const where: Record<string, unknown> = {};

    if (filter.search) {
      where.OR = [
        { name: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
      ];
    }
    if (filter.kind) where.kind = filter.kind;

    return this.prisma.zone.findMany({ where, orderBy: { name: 'asc' } });
  }

  async update(id: string, input: UpdateZoneInput) {
    await this.findById(id);
    const { id: _id, ...data } = input;
    return this.prisma.zone.update({ where: { id }, data });
  }

  async remove(id: string): Promise<boolean> {
    await this.findById(id);
    await this.prisma.zone.delete({ where: { id } });
    return true;
  }

  // ─── miembros de zona ───────────────────────────────────────

  async addMember(input: CreateZoneMemberInput) {
    const zone = await this.findById(input.zone_id);

    const member = await this.prisma.zoneMember.create({
      data: {
        zone_id: input.zone_id,
        zoneable_type: input.zoneable_type,
        zoneable_id: input.zoneable_id,
      },
    });

    await this.prisma.zone.update({
      where: { id: input.zone_id },
      data: { zone_members_count: (zone.zone_members_count ?? 0) + 1 },
    });

    return member;
  }

  async removeMember(memberId: string): Promise<boolean> {
    const member = await this.prisma.zoneMember.findUnique({
      where: { id: memberId },
    });
    if (!member) throw new AppNotFoundException('ZoneMember', memberId);

    await this.prisma.zoneMember.delete({ where: { id: memberId } });

    if (member.zone_id) {
      const zone = await this.prisma.zone.findUnique({
        where: { id: member.zone_id },
      });
      if (zone) {
        await this.prisma.zone.update({
          where: { id: member.zone_id },
          data: {
            zone_members_count: Math.max(
              (zone.zone_members_count ?? 0) - 1,
              0,
            ),
          },
        });
      }
    }

    return true;
  }

  async getMembersByZone(zoneId: string) {
    await this.findById(zoneId);
    return this.prisma.zoneMember.findMany({
      where: { zone_id: zoneId },
      orderBy: { created_at: 'asc' },
    });
  }

  // ─── RESOLUCIÓN DE ZONA POR DIRECCIÓN ───────────────────

  // resuelve la zona fiscal de un estado (stateId)
  // busca zone members con zoneable_type "GeoState"
  // si no encuentra, busca la zona default_tax
  async resolveZoneForState(stateId: string) {
    const member = await this.prisma.zoneMember.findFirst({
      where: {
        zoneable_type: 'GeoState',
        zoneable_id: stateId,
      },
      include: { zone: true },
    });

    if (member?.zone) return member.zone;

    // fallback: zona default
    return this.prisma.zone.findFirst({
      where: { default_tax: true },
    });
  }

  // ─── VALIDACIONES ────────────────────────────────────────

  async validateExists(id: string): Promise<boolean> {
    const zone = await this.prisma.zone.findUnique({ where: { id } });
    if (!zone) throw new AppNotFoundException('Zone', id);
    return true;
  }
}
