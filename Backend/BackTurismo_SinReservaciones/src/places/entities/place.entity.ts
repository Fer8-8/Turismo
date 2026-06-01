import { Field, Float, ID, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { Category } from '../../categories/entities/category.entity';
import { State } from "../../states/entities/state.entity";
import { PlaceAttribute } from "src/place-attributes/entities/place-attribute.entity";
import { PlaceTag } from "src/place-tags/entities/place-tag.entity";
import { Decimal } from "@prisma/client/runtime/index-browser";
import { Media } from "src/media/entities/media.entity";

@ObjectType()
export class Place {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String, { nullable: true })
  description: string | null

  @Field(() => String, { nullable: true })
  address: string | null

  @Field(() => Float, { nullable: true })
  latitude?: Decimal | null;

  @Field(() => Float, { nullable: true })
  longitude?: Decimal | null;

  @Field(() => ID, { nullable: true })
  id_category: string | null

  @Field(() => GraphQLJSON, { nullable: true })
  details: any | null

  @Field(() => ID, { nullable: true })
  contactDetails_id: string | null

  @Field(() => GraphQLJSON, { nullable: true })
  languages_details: any | null

  @Field(() => ID, { nullable: true })
  state_id: string | null

  @Field(() => State, { nullable: true })
  state?: State | null

  @Field(() => Category, { nullable: true })
  category?: Category | null

  @Field(() => Date, { nullable: true })
  created_at: Date | null

  @Field(() => Date, { nullable: true })
  updated_at: Date | null

  @Field(() => PlaceAttribute, { nullable: true })
  placeAttributes?: PlaceAttribute | null

  @Field(() => [PlaceTag], { nullable: true })
  placeTags?: PlaceTag[] | null

  @Field(() => [Media], { nullable: true })
  medias?: Media[] | null

  @Field(() => Float, { nullable: true, description: "Distance in kilometers (only nerby method)" })
  distance?: number | null

  @Field(() => ID, { nullable: true })
  city_id: string | null

  @Field(() => Place, { nullable: true })
  city?: Place | null

  @Field(() => [Place], { nullable: true })
  places?: Place[] | null
}
