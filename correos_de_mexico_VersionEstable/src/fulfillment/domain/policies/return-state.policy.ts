import { ReturnAuthorizationState } from '../enums/return-authorization-state.enum';

const TRANSITIONS: Record<ReturnAuthorizationState, ReturnAuthorizationState[]> = {
  [ReturnAuthorizationState.REQUESTED]: [
    ReturnAuthorizationState.AUTHORIZED,
    ReturnAuthorizationState.REJECTED,
    ReturnAuthorizationState.CANCELLED,
  ],
  [ReturnAuthorizationState.AUTHORIZED]: [
    ReturnAuthorizationState.RECEIVED,
    ReturnAuthorizationState.APPROVED,
    ReturnAuthorizationState.REJECTED,
    ReturnAuthorizationState.CANCELLED,
  ],
  [ReturnAuthorizationState.RECEIVED]: [
    ReturnAuthorizationState.APPROVED,
    ReturnAuthorizationState.REJECTED,
    ReturnAuthorizationState.CANCELLED,
  ],
  [ReturnAuthorizationState.APPROVED]: [],
  [ReturnAuthorizationState.REJECTED]: [],
  [ReturnAuthorizationState.CANCELLED]: [],
};

export function canTransitionReturnAuthorizationState(
  currentState: string | null | undefined,
  nextState: ReturnAuthorizationState,
) {
  if (!currentState) {
    return nextState === ReturnAuthorizationState.REQUESTED;
  }

  if (currentState === nextState) {
    return true;
  }

  const allowedTransitions = TRANSITIONS[currentState as ReturnAuthorizationState] ?? [];
  return allowedTransitions.includes(nextState);
}

export function isReturnAuthorizationTerminalState(state: string | null | undefined) {
  return [
    ReturnAuthorizationState.APPROVED,
    ReturnAuthorizationState.REJECTED,
    ReturnAuthorizationState.CANCELLED,
  ].includes((state ?? '') as ReturnAuthorizationState);
}