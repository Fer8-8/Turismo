import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { device_types } from '../enums/device_types.enum';

@InputType()
export class CreateUserSessionInput {
  @Field(() => ID, { nullable: true })
  user_id?: string | null;

  @Field(() => device_types, { description: "Device session type (mobile | desktop)" })
  device_type: device_types;

  @Field(() => String)
  device_os: string;

  @Field(() => String)
  browser: string;

  @Field(() => String)
  ip_address: string;

  @Field(() => String)
  city: string;

  @Field(() => String)
  state: string;

  @Field(() => String)
  country: string;

  @Field(() => Date)
  started_at: Date;
  
  @Field(() => Date)
  ended_at: Date;

  @Field(() => Int)
  duration_seconds: number;

  @Field(() => Int)
  page_views: number;

  @Field(() => Boolean)
  had_interaction?: boolean;

  @Field(() => Boolean)
  had_favorite?: boolean;

  // @Field(() => [ID])
  // RecommendationLogs: [];

  // @Field(() => [UserInteractions])
  // user_interactions: [];
}
