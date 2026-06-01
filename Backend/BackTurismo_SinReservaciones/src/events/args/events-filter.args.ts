import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsUUID, IsBoolean } from 'class-validator';

@ArgsType()
export class EventsFilterArgs {
  @IsOptional()
  @IsUUID(undefined, { each: true })
  @Field(() => [String], { nullable: true })
  id_state?: string[] = [];

  @IsOptional()
  @IsUUID(undefined, { each: true })
  @Field(() => [String], { nullable: true })
  id_category?: string[] = [];

  @IsOptional()
  @Field(() => Date, { nullable: true })
  start_date?: Date;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  end_date?: Date;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  is_active?: boolean;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  mime_type?: string[] = [];

  @IsOptional()
  @Field(() => [Boolean], { nullable: true })
  isCover?: boolean[] = [];
}
