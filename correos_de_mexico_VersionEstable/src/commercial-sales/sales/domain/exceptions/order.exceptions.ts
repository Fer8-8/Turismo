import {
  AppNotFoundException,
  BusinessException,
  AppValidationException,
} from '../../../../core/shared';

export class OrderNotFoundException extends AppNotFoundException {
  constructor(id: string) {
    super('Order', id);
  }
}

export class LineItemNotFoundException extends AppNotFoundException {
  constructor(id: string) {
    super('LineItem', id);
  }
}

export class OrderAlreadyCancelledException extends BusinessException {
  constructor(orderId: string) {
    super(`La orden ${orderId} ya está cancelada`);
  }
}

export class OrderNotEditableException extends BusinessException {
  constructor(orderId: string, currentState: string) {
    super(
      `La orden ${orderId} no puede modificarse en estado "${currentState}"`,
    );
  }
}

export class InvalidOrderStateTransitionException extends BusinessException {
  constructor(from: string, to: string) {
    super(`Transición de estado inválida: ${from} → ${to}`);
  }
}

export class LineItemQuantityException extends AppValidationException {
  constructor(quantity: number) {
    super({ quantity: [`La cantidad debe ser mayor a 0; recibido: ${quantity}`] });
  }
}

export class VariantUnavailableException extends BusinessException {
  constructor(variantId: string) {
    super(`La variante ${variantId} no está disponible para venta`);
  }
}

export class InsufficientInventoryException extends BusinessException {
  constructor(variantId: string, requested: number, available: number) {
    super(
      `Stock insuficiente para variante ${variantId}: solicitado ${requested}, disponible ${available}`,
    );
  }
}

export class OrderAddressNotFoundException extends AppNotFoundException {
  constructor(addressId: string) {
    super('Address', addressId);
  }
}

export class DuplicateLineItemException extends BusinessException {
  constructor(variantId: string) {
    super(
      `La variante ${variantId} ya existe en la orden; usa updateLineItemQuantity para modificarla`,
    );
  }
}

export class OrderOwnershipException extends BusinessException {
  constructor(orderId: string, userId: string) {
    super(`La orden ${orderId} no pertenece al usuario ${userId}`);
  }
}

export class OrderNotPayableException extends BusinessException {
  constructor(orderId: string, state: string) {
    super(`La orden ${orderId} no es pagable en estado "${state}"`);
  }
}

export class OrderNotFulfillabeException extends BusinessException {
  constructor(orderId: string, state: string) {
    super(`La orden ${orderId} no es fulfillable en estado "${state}"`);
  }
}
