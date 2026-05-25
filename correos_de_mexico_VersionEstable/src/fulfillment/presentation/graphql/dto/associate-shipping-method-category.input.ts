import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class AssociateShippingMethodCategoryInput {
  @Field(() => ID)
  @IsUUID()
  methodId: string;

  @Field(() => ID)
  @IsUUID()
  categoryId: string;
}