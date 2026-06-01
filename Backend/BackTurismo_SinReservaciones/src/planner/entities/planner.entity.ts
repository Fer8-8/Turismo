import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { registerEnumType } from '@nestjs/graphql';
import { routes_status } from '@prisma/client';
import { State } from 'src/states/entities/state.entity';
import { User } from 'src/users/entities/user.entity';

registerEnumType(routes_status, {
  name: 'routes_status',
  description: 'Estados posibles para una ruta en el planner'
});

@ObjectType()
export class Planner {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Date)
  start_date: Date;

  @Field(() => Date)
  end_date: Date;

  @Field(() => Int)
  people: number;

  @Field(() => Float)
  budget: number;

  @Field(() => String, { nullable: true })
  state_id?: string | null;

  @Field(() => State, { nullable: true })
  state?: State;

  @Field(() => String, { nullable: true })
  user_id?: string | null;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => routes_status)
  status: routes_status;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;
}
