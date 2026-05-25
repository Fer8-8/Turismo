// Module
export { SharedModule } from './shared.module';

// Event Bus & Outbox
export { EventBusService } from './event-bus/index';
export { OutboxService, OutboxProcessor } from './outbox/index';
export type { OutboxEventRecord } from './outbox/index';

// Events
export {
  BaseEvent,
  OrderCreatedEvent,
  OrderCancelledEvent,
  PaymentAuthorizedEvent,
  PaymentCapturedEvent,
  ShipmentShippedEvent,
  ReturnApprovedEvent,
} from './events/index';

// Guards
export { StoreContextGuard } from './guards/index';
export type { StoreContext } from './guards/index';

// Decorators
export {
  CurrentStore,
  SkipStoreContext,
  SKIP_STORE_CONTEXT_KEY,
} from './decorators/index';

// Exceptions
export {
  AppException,
  AppValidationException,
  AppNotFoundException,
  AppConflictException,
  BusinessException,
  MissingStoreIdException,
  UnauthorizedAccessException,
} from './exceptions/index';

// Validators
export {
  IsValidEmail,
  IsValidPhone,
  IsValidUUID,
  IsValidStoreId,
  IsPositive,
  IsValidZipcode,
} from './validators/index';

// Listeners
export type { EventListener, EventListenerRegistry } from './listeners/index';

// DTOs
export { PaginationArgs, Paginated, SortArgs, SortDirection } from './dtos/index';

// Configuration
export {
  EVENT_NAMES,
  OUTBOX_CONFIG,
  STORE_CONTEXT_CONFIG,
  VALIDATION_CONFIG,
  PAGINATION_CONFIG,
  ERROR_MESSAGES,
  LOGGER_CONFIG,
} from './config/shared.config';
