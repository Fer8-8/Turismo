import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
@ObjectType()
export class Payment {
  
  @Field(() => ID)
  id : string 

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

  @Field(() => String, { nullable: true })
  last_4?: string 

  @Field(() => ID)
  user_id: string 

  @Field(() => User)
  user: User 

  @Field(() => Date)
  created_at: Date 

  @Field(() => Date)
  updated_at: Date 

}
