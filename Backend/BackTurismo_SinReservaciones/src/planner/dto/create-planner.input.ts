import { InputType, Int, Field, ID, Float } from '@nestjs/graphql';
import { routes_status } from '@prisma/client';
import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
@InputType()
export class CreatePlannerInput {

    @Field()
    @IsString()
    name: string;
  
    @Field()
    start_date:Date;
  
    @Field()
    end_date:Date;
  
    @Field(() => Int)
    @IsNumber()
    people: number
  
    @Field(() => Float)
    @IsNumber()
    budget : number
  
    @Field({nullable: true})
    @IsOptional()
    @IsString()
    state_id?: string
  
    @Field({nullable: true})
    @IsOptional()
    @IsString()
    user_id?: string
  
    @Field(() => routes_status)
    @IsEnum(routes_status)
    status: routes_status;
}

