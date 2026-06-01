import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsUUID, IsString } from 'class-validator';

@ArgsType()
export class PlacesFilterArgs {
  @IsOptional()
  @IsUUID()
  @Field(() => [String], { nullable: true })
  id_category?: string[] = [];

  @IsOptional()
  @IsUUID()
  @Field(() => [String], { nullable: true })
  state_id?: string[] = [];

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  name?: string;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  mime_type?: string[] = [];

  @IsOptional()
  @Field(() => [Boolean], { nullable: true })
  isCover?: boolean[] = [];
}
