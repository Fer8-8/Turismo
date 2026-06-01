import { CreateUserfeaturescacheInput } from './create-userfeaturescache.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateUserfeaturescacheInput extends PartialType(CreateUserfeaturescacheInput) {
  @IsUUID()
  @Field(() => ID)
  id: string;
}
