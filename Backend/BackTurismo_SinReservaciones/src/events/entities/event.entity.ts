import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { State } from 'src/states/entities/state.entity';
import { Media } from 'src/media/entities/media.entity';
import { Category } from 'src/categories/entities/category.entity';

@ObjectType()
export class Event {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => Date)
  start_date: Date

  @Field(() => Date)
  end_date: Date

  @Field(() => ID, { nullable: true })
  id_state?: string | null

  @Field(() => State, { nullable: true })
  state?: State | null

  @Field(() => GraphQLJSON)
  details: any

  @Field(() => ID, { nullable: true })
  contactDetails_id?: string | null

  @Field(() => Boolean)
  isTradition: boolean

  @Field(() => GraphQLJSON)
  languages_details: any

  @Field(() => Date)
  created_at: Date

  @Field(() => Date)
  updated_at: Date

  @Field(() => [Media], { nullable: true })
  medias?: Media[] | null

  @Field(() => ID, { nullable: true })
  id_category?: string | null

  @Field(() => Category, { nullable: true })
  category?: Category | null
}
