import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PaymentMethodNotFoundException } from '../../domain/exceptions';

export interface CreatePaymentMethodData {
  name: string;
  type?: string;
  description?: string;
  active?: boolean;
  auto_capture?: boolean;
  preferences?: string;
  position?: number;
  display_on?: string;
}

export interface UpdatePaymentMethodData {
  name?: string;
  type?: string;
  description?: string;
  active?: boolean;
  auto_capture?: boolean;
  preferences?: string;
  position?: number;
  display_on?: string;
}

@Injectable()
export class PaymentMethodRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePaymentMethodData) {
    return this.prisma.paymentMethod.create({
      data: {
        name: data.name,
        type: data.type,
        description: data.description,
        active: data.active ?? true,
        auto_capture: data.auto_capture,
        preferences: data.preferences,
        position: data.position ?? 0,
        display_on: data.display_on ?? 'both',
      },
    });
  }

  async findById(id: string) {
    return this.prisma.paymentMethod.findUnique({
      where: { id },
    });
  }

  async findByIdOrThrow(id: string) {
    const method = await this.findById(id);
    if (!method) throw new PaymentMethodNotFoundException(id);
    return method;
  }

  async findAll(includeInactive = false) {
    return this.prisma.paymentMethod.findMany({
      where: {
        deleted_at: null,
        ...(includeInactive ? {} : { active: true }),
      },
      orderBy: { position: 'asc' },
    });
  }

  async update(id: string, data: UpdatePaymentMethodData) {
    return this.prisma.paymentMethod.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string) {
    return this.prisma.paymentMethod.update({
      where: { id },
      data: { deleted_at: new Date(), active: false },
    });
  }

  // ─── asociaciones de tienda ──────────────────────────────

  async findStoreAssociations(storeId: string) {
    return this.prisma.paymentMethodsStore.findMany({
      where: { store_id: storeId },
      include: { paymentMethod: true },
    });
  }

  async findActiveMethodsForStore(storeId: string) {
    const associations = await this.prisma.paymentMethodsStore.findMany({
      where: { store_id: storeId },
      include: {
        paymentMethod: true,
      },
    });
    return associations
      .map((a) => a.paymentMethod)
      .filter((m) => m.active && !m.deleted_at);
  }

  async isMethodAvailableForStore(
    methodId: string,
    storeId: string,
  ): Promise<boolean> {
    const association = await this.prisma.paymentMethodsStore.findUnique({
      where: {
        payment_method_id_store_id: {
          payment_method_id: methodId,
          store_id: storeId,
        },
      },
      include: { paymentMethod: true },
    });
    return !!association && association.paymentMethod.active && !association.paymentMethod.deleted_at;
  }

  async associateToStore(methodId: string, storeId: string) {
    return this.prisma.paymentMethodsStore.upsert({
      where: {
        payment_method_id_store_id: {
          payment_method_id: methodId,
          store_id: storeId,
        },
      },
      create: {
        payment_method_id: methodId,
        store_id: storeId,
      },
      update: {},
    });
  }

  async disassociateFromStore(methodId: string, storeId: string) {
    return this.prisma.paymentMethodsStore.deleteMany({
      where: {
        payment_method_id: methodId,
        store_id: storeId,
      },
    });
  }
}
