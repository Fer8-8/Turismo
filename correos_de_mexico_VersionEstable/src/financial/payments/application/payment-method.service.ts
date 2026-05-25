import { Injectable } from '@nestjs/common';
import { PaymentMethodRepository } from '../infrastructure/repositories/payment-method.repository';

export interface CreatePaymentMethodInput {
  name: string;
  type?: string;
  description?: string;
  active?: boolean;
  auto_capture?: boolean;
  preferences?: string;
  position?: number;
  display_on?: string;
}

export interface UpdatePaymentMethodInput {
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
export class PaymentMethodService {
  constructor(private readonly paymentMethodRepo: PaymentMethodRepository) {}

  createPaymentMethod(data: CreatePaymentMethodInput) {
    return this.paymentMethodRepo.create(data);
  }

  getPaymentMethod(id: string) {
    return this.paymentMethodRepo.findByIdOrThrow(id);
  }

  listPaymentMethods(includeInactive = false) {
    return this.paymentMethodRepo.findAll(includeInactive);
  }

  updatePaymentMethod(id: string, data: UpdatePaymentMethodInput) {
    return this.paymentMethodRepo.update(id, data);
  }

  async activatePaymentMethod(id: string) {
    await this.paymentMethodRepo.findByIdOrThrow(id);
    return this.paymentMethodRepo.update(id, { active: true });
  }

  async deactivatePaymentMethod(id: string) {
    await this.paymentMethodRepo.findByIdOrThrow(id);
    return this.paymentMethodRepo.update(id, { active: false });
  }

  // ─── STORE ASSOCIATIONS ──────────────────────────────────

  listMethodsForStore(storeId: string) {
    return this.paymentMethodRepo.findActiveMethodsForStore(storeId);
  }

  async associateToStore(methodId: string, storeId: string) {
    await this.paymentMethodRepo.findByIdOrThrow(methodId);
    return this.paymentMethodRepo.associateToStore(methodId, storeId);
  }

  async disassociateFromStore(methodId: string, storeId: string) {
    await this.paymentMethodRepo.findByIdOrThrow(methodId);
    return this.paymentMethodRepo.disassociateFromStore(methodId, storeId);
  }

  isMethodAvailableForStore(methodId: string, storeId: string) {
    return this.paymentMethodRepo.isMethodAvailableForStore(methodId, storeId);
  }
}
