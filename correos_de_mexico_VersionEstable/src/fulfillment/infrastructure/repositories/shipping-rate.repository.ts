import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ShippingRateNotFoundException } from '../../domain/exceptions/fulfillment.exceptions';

export interface CreateShippingRateData {
  shipment_id: string;
  shipping_method_id: string;
  cost: number;
  selected?: boolean;
  tax_rate_id?: string | null;
}

export interface UpdateShippingRateData {
  cost?: number;
  selected?: boolean;
  tax_rate_id?: string | null;
}

const SHIPPING_RATE_INCLUDE = {
  shippingMethod: true,
} as const;

@Injectable()
export class ShippingRateRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateShippingRateData) {
    return this.prisma.shippingRate.create({
      data,
      include: SHIPPING_RATE_INCLUDE,
    });
  }

  findById(id: string) {
    return this.prisma.shippingRate.findUnique({
      where: { id },
      include: SHIPPING_RATE_INCLUDE,
    });
  }

  async findByIdOrThrow(id: string) {
    const rate = await this.findById(id);
    if (!rate) {
      throw new ShippingRateNotFoundException(id);
    }

    return rate;
  }

  findByShipment(shipmentId: string) {
    return this.prisma.shippingRate.findMany({
      where: { shipment_id: shipmentId },
      include: SHIPPING_RATE_INCLUDE,
      orderBy: [{ selected: 'desc' }, { created_at: 'asc' }],
    });
  }

  async update(id: string, data: UpdateShippingRateData) {
    await this.findByIdOrThrow(id);
    return this.prisma.shippingRate.update({
      where: { id },
      data,
      include: SHIPPING_RATE_INCLUDE,
    });
  }

  deselectByShipment(shipmentId: string) {
    return this.prisma.shippingRate.updateMany({
      where: { shipment_id: shipmentId, selected: true },
      data: { selected: false },
    });
  }

  async select(id: string) {
    await this.findByIdOrThrow(id);
    return this.prisma.shippingRate.update({
      where: { id },
      data: { selected: true },
      include: SHIPPING_RATE_INCLUDE,
    });
  }
}