import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Taxon } from './taxon.entity';

@ObjectType()
export class Taxonomy {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => Int)
  position: number;

  @Field(() => String, { nullable: true })
  store_id?: string;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;

  @Field(() => [Taxon], { nullable: true })
  taxons?: Taxon[];
}
