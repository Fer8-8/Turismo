import { ReturnAuthorizationState } from '../enums/return-authorization-state.enum';
import {
  canTransitionReturnAuthorizationState,
  isReturnAuthorizationTerminalState,
} from './return-state.policy';

describe('return-state.policy', () => {
  it('does not allow requested return authorizations to move directly to received', () => {
    expect(
      canTransitionReturnAuthorizationState(
        ReturnAuthorizationState.REQUESTED,
        ReturnAuthorizationState.RECEIVED,
      ),
    ).toBe(false);
  });

  it('allows authorized return authorizations to move to received', () => {
    expect(
      canTransitionReturnAuthorizationState(
        ReturnAuthorizationState.AUTHORIZED,
        ReturnAuthorizationState.RECEIVED,
      ),
    ).toBe(true);
  });

  it('keeps approved, rejected and cancelled as terminal states', () => {
    expect(isReturnAuthorizationTerminalState(ReturnAuthorizationState.APPROVED)).toBe(true);
    expect(isReturnAuthorizationTerminalState(ReturnAuthorizationState.REJECTED)).toBe(true);
    expect(isReturnAuthorizationTerminalState(ReturnAuthorizationState.CANCELLED)).toBe(true);
  });

  it('does not allow terminal return authorizations to transition again', () => {
    expect(
      canTransitionReturnAuthorizationState(
        ReturnAuthorizationState.APPROVED,
        ReturnAuthorizationState.REJECTED,
      ),
    ).toBe(false);
    expect(
      canTransitionReturnAuthorizationState(
        ReturnAuthorizationState.CANCELLED,
        ReturnAuthorizationState.AUTHORIZED,
      ),
    ).toBe(false);
  });

  it('allows idempotent transitions to the same state', () => {
    expect(
      canTransitionReturnAuthorizationState(
        ReturnAuthorizationState.REQUESTED,
        ReturnAuthorizationState.REQUESTED,
      ),
    ).toBe(true);
  });
});