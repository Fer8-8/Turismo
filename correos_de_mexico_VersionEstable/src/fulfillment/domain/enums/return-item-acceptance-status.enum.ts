import { registerEnumType } from '@nestjs/graphql';

export enum ReturnItemAcceptanceStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

registerEnumType(ReturnItemAcceptanceStatus, {
  name: 'ReturnItemAcceptanceStatus',
  description: 'Operational evaluation status of a returned item',
});