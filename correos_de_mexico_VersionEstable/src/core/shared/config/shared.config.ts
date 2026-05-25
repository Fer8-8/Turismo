// configuración central del módulo compartido

// eventos que usa la aplicación

export const EVENT_NAMES = {
  ORDER_CREATED: 'order.created',
  ORDER_CANCELLED: 'order.cancelled',
  PAYMENT_AUTHORIZED: 'payment.authorized',
  PAYMENT_CAPTURED: 'payment.captured',
  SHIPMENT_SHIPPED: 'shipment.shipped',
  RETURN_APPROVED: 'return.approved',
  INVENTORY_RESERVED: 'inventory.reserved',
  INVENTORY_ALLOCATION_FAILED: 'inventory.allocation_failed',
} as const;

// reintentos y limpieza del outbox

export const OUTBOX_CONFIG = {
  MAX_RETRIES: 3,
  RETENTION_DAYS: 30,
  POLLING_INTERVAL_SEC: 5, // cada 5 segundos
  CLEANUP_TIME: '0 2 * * *', // 2 am cada día
} as const;

// encabezados para contexto de tienda

export const STORE_CONTEXT_CONFIG = {
  HEADER_NAME: 'x-store-id',
  HEADER_NAME_UPPERCASE: 'X-Store-Id',
} as const;

// validaciones con expresiones regulares

export const VALIDATION_CONFIG = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^(\+\d{1,3})?[\s.-]?\d{7,14}$/,
  UUID_REGEX: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  ZIPCODE_REGEX: /^\d{5}(-\d{4})?$/,
} as const;

// configuración de paginación

export const PAGINATION_CONFIG = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;

// mensajes de error

export const ERROR_MESSAGES = {
  MISSING_STORE_ID: 'Se requiere el header X-Store-Id',
  STORE_NOT_FOUND: 'Tienda no encontrada o inactiva',
  UNAUTHORIZED_ACCESS: 'No tienes acceso a este recurso',
  VALIDATION_ERROR: 'Error de validación',
  RESOURCE_NOT_FOUND: 'Recurso no encontrado',
  CONFLICT: 'Conflicto: el recurso ya existe',
  BUSINESS_RULE_VIOLATION: 'Violación de regla de negocio',
} as const;

// configuración del logger

export const LOGGER_CONFIG = {
  CONTEXT_PREFIX: '[CDM]',
  ENABLE_TIMESTAMPS: true,
  ENABLE_DEBUG: process.env.DEBUG === 'true',
} as const;
