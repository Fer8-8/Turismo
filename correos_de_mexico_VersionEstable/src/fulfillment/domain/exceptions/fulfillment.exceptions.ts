import { AppNotFoundException, BusinessException } from '../../../core/shared';

export class ShipmentNotFoundException extends AppNotFoundException {
  constructor(id: string) {
    super('Shipment', id);
  }
}

export class ShippingMethodNotFoundException extends AppNotFoundException {
  constructor(id: string) {
    super('ShippingMethod', id);
  }
}

export class ShippingRateNotFoundException extends AppNotFoundException {
  constructor(id: string) {
    super('ShippingRate', id);
  }
}

export class ShippingCategoryNotFoundException extends AppNotFoundException {
  constructor(id: string) {
    super('ShippingCategory', id);
  }
}

export class ShipmentOrderContextException extends BusinessException {
  constructor(message: string) {
    super(message, 'SHIPMENT_ORDER_CONTEXT_INVALID');
  }
}

export class ShipmentStateTransitionException extends BusinessException {
  constructor(currentState: string | null | undefined, nextState: string) {
    super(
      `No se puede transicionar el envío de "${currentState ?? 'desconocido'}" a "${nextState}"`,
      'SHIPMENT_STATE_TRANSITION_INVALID',
    );
  }
}

export class ShippingMethodAvailabilityException extends BusinessException {
  constructor(methodId: string, context: string) {
    super(
      `El método de envío ${methodId} no está disponible para ${context}`,
      'SHIPPING_METHOD_UNAVAILABLE',
    );
  }
}

export class ShippingRateSelectionException extends BusinessException {
  constructor(message: string) {
    super(message, 'SHIPPING_RATE_SELECTION_INVALID');
  }
}

export class FulfillmentScopeException extends BusinessException {
  constructor(message: string) {
    super(message, 'FULFILLMENT_SCOPE_INVALID');
  }
}

export class ReturnAuthorizationNotFoundException extends AppNotFoundException {
  constructor(id: string) {
    super('ReturnAuthorization', id);
  }
}

export class ReturnAuthorizationReasonNotFoundException extends AppNotFoundException {
  constructor(id: string) {
    super('ReturnAuthorizationReason', id);
  }
}

export class ReturnItemNotFoundException extends AppNotFoundException {
  constructor(id: string) {
    super('ReturnItem', id);
  }
}

export class CustomerReturnNotFoundException extends AppNotFoundException {
  constructor(id: string) {
    super('CustomerReturn', id);
  }
}

export class ReturnAuthorizationContextException extends BusinessException {
  constructor(message: string) {
    super(message, 'RETURN_AUTHORIZATION_CONTEXT_INVALID');
  }
}

export class ReturnAuthorizationStateTransitionException extends BusinessException {
  constructor(currentState: string | null | undefined, nextState: string) {
    super(
      `No se puede transicionar la autorización de devolución de "${currentState ?? 'desconocido'}" a "${nextState}"`,
      'RETURN_AUTHORIZATION_STATE_TRANSITION_INVALID',
    );
  }
}

export class ReturnItemScopeException extends BusinessException {
  constructor(message: string) {
    super(message, 'RETURN_ITEM_SCOPE_INVALID');
  }
}

export class ReturnReasonImmutableException extends BusinessException {
  constructor(reasonId: string) {
    super(
      `ReturnAuthorizationReason "${reasonId}" no puede modificarse porque es inmutable`,
      'RETURN_REASON_IMMUTABLE',
    );
  }
}

// ─── excepciones de reembolso ─────────────────────────────────────────────────

export class ReimbursementNotFoundException extends AppNotFoundException {
  constructor(id: string) {
    super('Reimbursement', id);
  }
}

export class ReimbursementTypeNotFoundException extends AppNotFoundException {
  constructor(id: string) {
    super('ReimbursementType', id);
  }
}

export class ReimbursementTypeImmutableException extends BusinessException {
  constructor(id: string) {
    super(
      `ReimbursementType "${id}" no puede modificarse porque es inmutable`,
      'REIMBURSEMENT_TYPE_IMMUTABLE',
    );
  }
}

export class ReimbursementCreditNotFoundException extends AppNotFoundException {
  constructor(id: string) {
    super('ReimbursementCredit', id);
  }
}

export class ReimbursementStateTransitionException extends BusinessException {
  constructor(from: string | null | undefined, to: string) {
    super(
      `No se puede transicionar el reembolso de "${from ?? 'desconocido'}" a "${to}"`,
      'REIMBURSEMENT_STATE_TRANSITION_INVALID',
    );
  }
}

export class ReimbursementScopeException extends BusinessException {
  constructor(message: string) {
    super(message, 'REIMBURSEMENT_SCOPE_INVALID');
  }
}
