import { InputType, Int, Field, ID } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { IsBoolean, IsDate, IsJSON, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class CreateEventInput {    
    
  @Field(() => String)
  name: string
    
  @IsDate()
  @Field(() => Date)
  start_date: Date
    
  @IsDate()
  @Field(() => Date)
  end_date: Date
  
  @IsUUID()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  id_state?: string
    
  @IsJSON()
  @Field(() => GraphQLJSON)
  details: any
    
  @IsUUID()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  contactDetails_id?: string
    
  @IsBoolean()
  @Field(() => Boolean)
  isTradition: boolean
    
  @IsJSON()
  @Field(() => GraphQLJSON)
  languages_details: any    

  @IsUUID()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  id_category?: string
}
