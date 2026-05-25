import { ReimbursementStatus } from '../enums/reimbursement-status.enum';
import {
  canTransitionReimbursementStatus,
  isReimbursementTerminalStatus,
} from './reimbursement-state.policy';

describe('reimbursement-state.policy', () => {
  it('allows the expected forward transitions for operational reimbursements', () => {
    expect(
      canTransitionReimbursementStatus(
        ReimbursementStatus.DRAFT,
        ReimbursementStatus.PENDING,
      ),
    ).toBe(true);
    expect(
      canTransitionReimbursementStatus(
        ReimbursementStatus.PENDING,
        ReimbursementStatus.PROCESSING,
      ),
    ).toBe(true);
    expect(
      canTransitionReimbursementStatus(
        ReimbursementStatus.FAILED,
        ReimbursementStatus.PENDING,
      ),
    ).toBe(true);
  });

  it('rejects invalid backward or terminal transitions', () => {
    expect(
      canTransitionReimbursementStatus(
        ReimbursementStatus.PROCESSING,
        ReimbursementStatus.PENDING,
      ),
    ).toBe(false);
    expect(
      canTransitionReimbursementStatus(
        ReimbursementStatus.COMPLETED,
        ReimbursementStatus.FAILED,
      ),
    ).toBe(false);
  });

  it('marks only completed and cancelled as terminal statuses', () => {
    expect(isReimbursementTerminalStatus(ReimbursementStatus.COMPLETED)).toBe(true);
    expect(isReimbursementTerminalStatus(ReimbursementStatus.CANCELLED)).toBe(true);
    expect(isReimbursementTerminalStatus(ReimbursementStatus.PROCESSING)).toBe(false);
  });
});