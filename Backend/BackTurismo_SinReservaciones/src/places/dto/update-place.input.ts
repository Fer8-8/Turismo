import { InputType, PartialType, Field, ID } from '@nestjs/graphql';
import { CreatePlaceInput } from './create-place.input';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdatePlaceInput extends PartialType(CreatePlaceInput) {
    @Field(() => ID)
    @IsUUID()
    id: string
}
