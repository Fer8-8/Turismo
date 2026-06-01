import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateFavoriteInput {
  @Field(() => ID, { nullable: true })
  place_id?: string;

  @Field(() => ID, { nullable: true })
  event_id?: string;
}
