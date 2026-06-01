import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class Language {
  @Field( () => String )
  id: string

  @Field( () => String )
  name: string

  @Field( () => String )
  abbr: string

  @Field( () => [User], { nullable: true } )
  users?: User[]

  @Field( () => Date )
  created_at: Date

  @Field( () => Date )
  updated_at: Date
}
