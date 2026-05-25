import { BaseEvent } from '../events/base.event';

// contrato base para listeners de eventos de dominio
export interface EventListener<T extends BaseEvent = BaseEvent> {
  // nombre del evento que maneja
  readonly eventName: string;

  // procesa el evento, debe ser idempotente
  handle(event: T): Promise<void>;
}

// registro central de listeners por evento
export interface EventListenerRegistry {
  // registra un listener para un evento
  register<T extends BaseEvent>(
    eventName: string,
    listener: EventListener<T>,
  ): void;

  // obtiene los listeners de un evento
  getListeners(eventName: string): EventListener[];

  // ejecuta todos los listeners de un evento
  handleEvent(event: BaseEvent): Promise<void>;
}
