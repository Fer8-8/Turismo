import { CreateUserSessionInput } from './create-user_session.input';
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserSessionInput extends PartialType(CreateUserSessionInput) {
  @Field(() => ID)
  id: string;
}
