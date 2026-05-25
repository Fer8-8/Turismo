import { registerEnumType } from '@nestjs/graphql';

export enum ReturnAuthorizationState {
  REQUESTED = 'requested',
  AUTHORIZED = 'authorized',
  RECEIVED = 'received',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

registerEnumType(ReturnAuthorizationState, {
  name: 'ReturnAuthorizationState',
  description: 'Operational state of a return authorization',
});