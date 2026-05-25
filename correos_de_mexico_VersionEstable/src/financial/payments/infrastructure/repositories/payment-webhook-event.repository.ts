import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';

export interface CreateWebhookEventData {
  gateway_code: string;
  provider_event_id: string;
  event_type: string;
  payment_intent_id?: string | null;
  payload: Record<string, unknown>;
}

@Injectable()
export class PaymentWebhookEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByProviderEventId(providerEventId: string) {
    return this.prisma.paymentWebhookEvent.findUnique({
      where: { provider_event_id: providerEventId },
    });
  }

  async createOrGet(data: CreateWebhookEventData) {
    try {
      return await this.prisma.paymentWebhookEvent.create({
        data: {
          gateway_code: data.gateway_code,
          provider_event_id: data.provider_event_id,
          event_type: data.event_type,
          payment_intent_id: data.payment_intent_id,
          payload: data.payload as Prisma.InputJsonValue,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const existing = await this.findByProviderEventId(data.provider_event_id);
        if (existing) return existing;
      }
      throw error;
    }
  }

  async markProcessed(
    id: string,
    paymentId?: string,
    paymentIntentId?: string | null,
  ) {
    return this.prisma.paymentWebhookEvent.update({
      where: { id },
      data: {
        status: 'PROCESSED',
        processed_at: new Date(),
        ...(paymentId ? { payment_id: paymentId } : {}),
        ...(paymentIntentId !== undefined ? { payment_intent_id: paymentIntentId } : {}),
        last_error: null,
      },
    });
  }

  async markIgnored(
    id: string,
    reason: string,
    paymentId?: string,
    paymentIntentId?: string | null,
  ) {
    return this.prisma.paymentWebhookEvent.update({
      where: { id },
      data: {
        status: 'IGNORED',
        processed_at: new Date(),
        last_error: reason,
        ...(paymentId ? { payment_id: paymentId } : {}),
        ...(paymentIntentId !== undefined ? { payment_intent_id: paymentIntentId } : {}),
      },
    });
  }

  async markFailed(
    id: string,
    reason: string,
    paymentId?: string,
    paymentIntentId?: string | null,
  ) {
    return this.prisma.paymentWebhookEvent.update({
      where: { id },
      data: {
        status: 'FAILED',
        last_error: reason,
        ...(paymentId ? { payment_id: paymentId } : {}),
        ...(paymentIntentId !== undefined ? { payment_intent_id: paymentIntentId } : {}),
      },
    });
  }
}
