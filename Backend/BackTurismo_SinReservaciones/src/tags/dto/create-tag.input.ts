import { InputType, Int, Field } from '@nestjs/graphql';
import { TagCategory } from '../enums/tagCategory.enum';

@InputType()
export class CreateTagInput {
  @Field(() => String)
  tag_name: string
  
  @Field(() => TagCategory)
  tag_category: TagCategory 
}
