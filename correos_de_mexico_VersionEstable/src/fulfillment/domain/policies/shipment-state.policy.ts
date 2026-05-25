import { ShipmentState } from '../enums/shipment-state.enum';

const SHIPMENT_TRANSITIONS: Record<string, ShipmentState[]> = {
  [ShipmentState.PENDING]: [ShipmentState.PENDING, ShipmentState.READY],
  [ShipmentState.READY]: [ShipmentState.PENDING, ShipmentState.READY, ShipmentState.SHIPPED],
  [ShipmentState.SHIPPED]: [ShipmentState.SHIPPED, ShipmentState.DELIVERED],
  [ShipmentState.DELIVERED]: [ShipmentState.DELIVERED],
};

export function canTransitionShipmentState(
  currentState: string | null | undefined,
  nextState: ShipmentState,
): boolean {
  const current = (currentState ?? ShipmentState.PENDING) as ShipmentState;
  return SHIPMENT_TRANSITIONS[current]?.includes(nextState) ?? false;
}

export function projectOrderShipmentState(states: Array<string | null | undefined>): ShipmentState {
  const normalized = states.map((state) => (state ?? ShipmentState.PENDING) as ShipmentState);

  if (normalized.length === 0) {
    return ShipmentState.PENDING;
  }

  if (normalized.every((state) => state === ShipmentState.DELIVERED)) {
    return ShipmentState.DELIVERED;
  }

  if (normalized.every((state) => [ShipmentState.SHIPPED, ShipmentState.DELIVERED].includes(state))) {
    return ShipmentState.SHIPPED;
  }

  if (normalized.every((state) => [ShipmentState.READY, ShipmentState.SHIPPED, ShipmentState.DELIVERED].includes(state))) {
    return ShipmentState.READY;
  }

  return ShipmentState.PENDING;
}

export function isScopedRecordVisible(
  isGlobal: boolean | null | undefined,
  recordStoreId: string | null | undefined,
  requestedStoreId?: string | null,
): boolean {
  if (isGlobal) {
    return true;
  }

  if (!requestedStoreId) {
    return !recordStoreId;
  }

  return recordStoreId === requestedStoreId;
}