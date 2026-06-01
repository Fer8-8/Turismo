import { Field, Int, ObjectType } from '@nestjs/graphql';
import { State } from '../entities/state.entity';
import { Info } from '../../common/pagination/models/info.model';

@ObjectType()
export class StatesResponse {
  @Field(() => Info)
  info: Info;

  @Field(() => [State])
  states: State[];
}
