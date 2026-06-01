import { InputType, Field, ID } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

@InputType()
export class CreatePaymentInput {

    @Field(() => String)
    card_number_hashed: string 
  
    @Field(() => String)
    expiry_date_hashed: string 
  
    @Field(() => String)
    cvc_hashed: string 
  
    @Field(() => String)
    name_card: string 
  
    @Field(() => String)
    surname_card: string 
  
    @Field(() => String)
    cardtype: string 

    @IsOptional()
    @Field(() => String, { nullable: true })
    last_4?: string 
  
    @Field(() => ID, { nullable: true })
    @IsUUID()
    user_id?: string; 

}