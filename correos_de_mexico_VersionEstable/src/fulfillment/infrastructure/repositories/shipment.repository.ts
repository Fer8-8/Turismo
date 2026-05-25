import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ShipmentNotFoundException } from '../../domain/exceptions/fulfillment.exceptions';
import { ShipmentAdminFilters } from '../../domain/contracts/fulfillment.contracts';
import { Prisma } from '../../../prisma/client';
import { ShipmentState } from '../../domain/enums/shipment-state.enum';
import { randomUUID } from 'crypto';

export interface CreateShipmentData {
  order_id: string;
  address_id: string;
  stock_location_id?: string | null;
  state: ShipmentState;
  cost?: number;
  additional_tax_total?: number;
  included_tax_total?: number;
  pre_tax_amount?: number;
  tracking?: string | null;
  pending_at?: Date | null;
}

export interface UpdateShipmentData {
  address_id?: string;
  stock_location_id?: string | null;
  tracking?: string | null;
  cost?: number;
  additional_tax_total?: number;
  included_tax_total?: number;
  pre_tax_amount?: number;
}

type ShipmentLifecycleDates = Partial<
  Record<'pending_at' | 'ready_at' | 'shipped_at' | 'delivered_at', Date>
>;

const SHIPMENT_INCLUDE = {
  shippingRates: {
    include: {
      shippingMethod: true,
    },
    orderBy: { created_at: 'asc' as const },
  },
} as const;

@Injectable()
export class ShipmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateShipmentData) {
    const createData = {
      number: this.generateShipmentNumber(),
      order_id: data.order_id,
      address_id: data.address_id,
      stock_location_id: data.stock_location_id ?? null,
      state: data.state,
      cost: data.cost ?? 0,
      additional_tax_total: data.additional_tax_total ?? 0,
      included_tax_total: data.included_tax_total ?? 0,
      pre_tax_amount: data.pre_tax_amount ?? data.cost ?? 0,
      tracking: data.tracking ?? null,
      pending_at: data.pending_at ?? new Date(),
    } satisfies Prisma.ShipmentUncheckedCreateInput;

    return this.prisma.shipment.create({
      data: createData,
      include: SHIPMENT_INCLUDE,
    });
  }

  async findById(id: string) {
    return this.prisma.shipment.findUnique({
      where: { id },
      include: SHIPMENT_INCLUDE,
    });
  }

  async findByIdOrThrow(id: string) {
    const shipment = await this.findById(id);
    if (!shipment) {
      throw new ShipmentNotFoundException(id);
    }

    return shipment;
  }

  findByOrder(orderId: string) {
    return this.prisma.shipment.findMany({
      where: { order_id: orderId },
      include: SHIPMENT_INCLUDE,
      orderBy: { created_at: 'asc' },
    });
  }

  async findMany(filters: ShipmentAdminFilters) {
    const { orderId, state, tracking, take = 50, skip = 0 } = filters;

    return this.prisma.shipment.findMany({
      where: {
        ...(orderId ? { order_id: orderId } : {}),
        ...(state ? { state } : {}),
        ...(tracking
          ? { tracking: { contains: tracking, mode: 'insensitive' } }
          : {}),
      },
      include: SHIPMENT_INCLUDE,
      orderBy: { created_at: 'desc' },
      take,
      skip,
    });
  }

  async update(id: string, data: UpdateShipmentData) {
    await this.findByIdOrThrow(id);
    const updateData: Prisma.ShipmentUncheckedUpdateInput = data;

    return this.prisma.shipment.update({
      where: { id },
      data: updateData,
      include: SHIPMENT_INCLUDE,
    });
  }

  async updateState(
    id: string,
    state: ShipmentState,
    dates: ShipmentLifecycleDates,
  ) {
    await this.findByIdOrThrow(id);
    const updateData = {
      state,
      ...dates,
    } satisfies Prisma.ShipmentUncheckedUpdateInput;

    return this.prisma.shipment.update({
      where: { id },
      data: updateData,
      include: SHIPMENT_INCLUDE,
    });
  }

  async updateTracking(id: string, tracking: string) {
    await this.findByIdOrThrow(id);
    return this.prisma.shipment.update({
      where: { id },
      data: { tracking },
      include: SHIPMENT_INCLUDE,
    });
  }

  async updateSelectedRateTotals(
    id: string,
    data: {
      cost: number;
      pre_tax_amount: number;
      additional_tax_total: number;
      included_tax_total: number;
    },
  ) {
    await this.findByIdOrThrow(id);
    const updateData = {
      cost: data.cost,
      pre_tax_amount: data.pre_tax_amount,
      additional_tax_total: data.additional_tax_total,
      included_tax_total: data.included_tax_total,
    } satisfies Prisma.ShipmentUncheckedUpdateInput;

    return this.prisma.shipment.update({
      where: { id },
      data: updateData,
      include: SHIPMENT_INCLUDE,
    });
  }

  async getOrderShipmentStates(orderId: string) {
    const shipments = await this.prisma.shipment.findMany({
      where: { order_id: orderId },
      select: { state: true },
    });

    return shipments.map((shipment) => shipment.state);
  }

  private generateShipmentNumber(): string {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase();
    return `S${ts}${rand}`;
  }
}