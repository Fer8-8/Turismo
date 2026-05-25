import { registerEnumType } from '@nestjs/graphql';

export enum ReimbursementTypeKind {
  REFUND = 'refund',
  EXCHANGE = 'exchange',
  ADJUSTMENT = 'adjustment',
}

registerEnumType(ReimbursementTypeKind, {
  name: 'ReimbursementTypeKind',
  description: 'Category of a reimbursement type',
});
