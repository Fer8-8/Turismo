import { registerEnumType } from '@nestjs/graphql';

export enum ReimbursementStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

registerEnumType(ReimbursementStatus, {
  name: 'ReimbursementStatus',
  description: 'Operational status of a reimbursement expedition',
});
