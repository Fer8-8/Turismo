import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => Boolean)
  emailVerified: boolean;

  @Field(() => String, { nullable: true })
  image?: string | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String, { nullable: true })
  role?: string | null;

  @Field(() => Boolean, { nullable: true })
  banned?: boolean | null;

  @Field(() => String, { nullable: true })
  banReason?: string | null;

  @Field(() => Date, { nullable: true })
  banExpires?: Date | null;

}
