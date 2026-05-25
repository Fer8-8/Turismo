import { registerEnumType } from '@nestjs/graphql';

export enum ReturnItemReceptionStatus {
  PENDING = 'pending',
  RECEIVED = 'received',
}

registerEnumType(ReturnItemReceptionStatus, {
  name: 'ReturnItemReceptionStatus',
  description: 'Physical reception status of a returned item',
});