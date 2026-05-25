import {
  AppNotFoundException,
  BusinessException,
  AppValidationException,
} from '../../../../core/shared';

export class PaymentNotFoundException extends AppNotFoundException {
  constructor(id: string) {
    super('Payment', id);
  }
}

export class PaymentMethodNotFoundException extends AppNotFoundException {
  constructor(id: string) {
    super('PaymentMethod', id);
  }
}

export class GatewayConfigNotFoundException extends AppNotFoundException {
  constructor(code: string) {
    super('GatewayConfig', code);
  }
}

export class InvalidPaymentStateTransitionException extends BusinessException {
  constructor(from: string, to: string) {
    super(`Transición de estado de pago inválida: ${from} → ${to}`);
  }
}

export class PaymentNotAuthorizedException extends BusinessException {
  constructor(paymentId: string) {
    super(`El pago ${paymentId} no está autorizado para captura`);
  }
}

export class PaymentAmountMismatchException extends AppValidationException {
  constructor(expected: number, received: number) {
    super({
      amount: [`El monto no coincide: esperado ${expected}, recibido ${received}`],
    });
  }
}

export class PaymentMethodDisabledException extends BusinessException {
  constructor(methodId: string) {
    super(`El método de pago ${methodId} no está activo`);
  }
}

export class PaymentMethodNotAvailableForStoreException extends BusinessException {
  constructor(methodId: string, storeId: string) {
    super(
      `El método de pago ${methodId} no está disponible para la tienda ${storeId}`,
    );
  }
}

export class OrderNotPayableException extends BusinessException {
  constructor(orderId: string, reason: string) {
    super(`La orden ${orderId} no es pagable: ${reason}`);
  }
}

export class PaymentProcessingException extends BusinessException {
  constructor(message: string) {
    super(`Error procesando pago: ${message}`);
  }
}

export class PaymentAlreadyCapturedException extends BusinessException {
  constructor(paymentId: string) {
    super(`El pago ${paymentId} ya fue capturado`);
  }
}

export class GatewayNotActiveException extends BusinessException {
  constructor(code: string) {
    super(`El gateway ${code} no está activo`);
  }
}

export class RefundNotFoundException extends AppNotFoundException {
  constructor(id: string) {
    super('Refund', id);
  }
}

export class RefundReasonNotFoundException extends AppNotFoundException {
  constructor(id: string) {
    super('RefundReason', id);
  }
}

export class RefundReasonDisabledException extends BusinessException {
  constructor(id: string) {
    super(`La razón de refund ${id} no está activa`);
  }
}

export class RefundAmountExceededException extends BusinessException {
  constructor(paymentId: string, available: number, requested: number) {
    super(
      `El refund para el pago ${paymentId} excede el monto disponible: disponible ${available}, solicitado ${requested}`,
    );
  }
}

export class RefundNotProcessableException extends BusinessException {
  constructor(paymentId: string, state: string) {
    super(`El pago ${paymentId} no permite refunds en estado "${state}"`);
  }
}

export class WebhookSignatureValidationException extends BusinessException {
  constructor() {
    super('La firma del webhook de Stripe es inválida');
  }
}
