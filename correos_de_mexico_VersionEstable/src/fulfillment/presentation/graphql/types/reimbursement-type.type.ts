import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ReimbursementTypeKind } from '../../../domain/enums/reimbursement-type-kind.enum';

@ObjectType()
export class ReimbursementKindType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  active: boolean;

  @Field()
  mutable: boolean;

  @Field(() => ReimbursementTypeKind, { nullable: true })
  type: ReimbursementTypeKind | null;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
