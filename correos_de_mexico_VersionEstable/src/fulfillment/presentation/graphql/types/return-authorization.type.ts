import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ReturnAuthorizationReasonType } from './return-authorization-reason.type';
import { ReturnItemType } from './return-item.type';

@ObjectType()
export class ReturnAuthorizationType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  number: string | null;

  @Field(() => String, { nullable: true })
  state: string | null;

  @Field(() => ID, { nullable: true })
  order_id: string | null;

  @Field(() => String, { nullable: true })
  memo: string | null;

  @Field(() => Date, { nullable: true })
  created_at: Date | null;

  @Field(() => Date, { nullable: true })
  updated_at: Date | null;

  @Field(() => ID, { nullable: true })
  stock_location_id: string | null;

  @Field(() => ID, { nullable: true })
  return_authorization_reason_id: string | null;

  @Field(() => ReturnAuthorizationReasonType, { nullable: true })
  returnAuthorizationReason: ReturnAuthorizationReasonType | null;

  @Field(() => [ReturnItemType])
  returnItems: ReturnItemType[];
}