import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class CreateZoneMemberInput {
  @Field(() => ID)
  @IsUUID()
  zone_id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  zoneable_type?: string;

  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  zoneable_id?: string;
}
