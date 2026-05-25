import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ReimbursementCreditType {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  reimbursement_id: string | null;

  @Field(() => Float)
  amount: number;

  @Field(() => ID, { nullable: true })
  creditable_id: string | null;

  @Field(() => String, { nullable: true })
  creditable_type: string | null;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
