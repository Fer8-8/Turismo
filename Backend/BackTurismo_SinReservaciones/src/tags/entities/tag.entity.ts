import { ObjectType, Field, ID } from '@nestjs/graphql';
import { TagCategory } from '../enums/tagCategory.enum';

@ObjectType()
export class Tag {
  @Field(() => ID)
  id: string
  
  @Field(() => String)
  tag_name: string
  
  @Field(() => TagCategory)
  tag_category: TagCategory
  
  @Field(() => Date, { nullable: true })
  created_at: Date | null
  
  @Field(() => Date, { nullable: true })
  updated_at: Date | null

  //TODO: Relacion con tablas de PlaceTags
}