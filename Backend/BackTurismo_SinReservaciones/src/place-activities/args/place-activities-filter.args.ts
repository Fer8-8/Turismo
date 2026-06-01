import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ArgsType()
export class PlaceActivitiesFilterArgs {
  @IsOptional()
  @Field(() => [String], { nullable: true })
  mime_type?: string[] = [];

  @IsOptional()
  @Field(() => [Boolean], { nullable: true })
  isCover?: boolean[] = [];
}
