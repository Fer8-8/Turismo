import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ReturnItemType } from './return-item.type';

@ObjectType()
export class CustomerReturnType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  number: string | null;

  @Field(() => ID, { nullable: true })
  stock_location_id: string | null;

  @Field(() => ID, { nullable: true })
  store_id: string | null;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => [ReturnItemType])
  returnItems: ReturnItemType[];
}