import { ReimbursementStatus } from '../enums/reimbursement-status.enum';

const TRANSITIONS: Record<ReimbursementStatus, ReimbursementStatus[]> = {
  [ReimbursementStatus.DRAFT]: [
    ReimbursementStatus.PENDING,
    ReimbursementStatus.CANCELLED,
  ],
  [ReimbursementStatus.PENDING]: [
    ReimbursementStatus.PROCESSING,
    ReimbursementStatus.FAILED,
    ReimbursementStatus.CANCELLED,
  ],
  [ReimbursementStatus.PROCESSING]: [
    ReimbursementStatus.COMPLETED,
    ReimbursementStatus.FAILED,
  ],
  [ReimbursementStatus.COMPLETED]: [],
  [ReimbursementStatus.FAILED]: [
    ReimbursementStatus.PENDING,
    ReimbursementStatus.CANCELLED,
  ],
  [ReimbursementStatus.CANCELLED]: [],
};

export function canTransitionReimbursementStatus(
  currentStatus: string | null | undefined,
  nextStatus: ReimbursementStatus,
): boolean {
  if (!currentStatus) {
    return nextStatus === ReimbursementStatus.DRAFT;
  }

  const allowed = TRANSITIONS[currentStatus as ReimbursementStatus] ?? [];
  return allowed.includes(nextStatus);
}

export function isReimbursementTerminalStatus(
  status: string | null | undefined,
): boolean {
  return [ReimbursementStatus.COMPLETED, ReimbursementStatus.CANCELLED].includes(
    (status ?? '') as ReimbursementStatus,
  );
}
