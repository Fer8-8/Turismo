import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class Currency {
  @Field( () => ID)
  id: string
  
  @Field( () => String)
  name: string
  
  @Field( () => String)
  abbr: string
  
  @Field( () => Date)
  created_at: Date
  
  @Field( () => Date)
  updated_at: Date
  
  @Field( () => [User], { nullable: true })
  users?: User[]
}

