import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Taxon {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  permalink?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  meta_title?: string;

  @Field(() => String, { nullable: true })
  meta_description?: string;

  @Field(() => String, { nullable: true })
  meta_keywords?: string;

  @Field(() => Int)
  position: number;

  @Field(() => Int, { nullable: true })
  depth?: number;

  @Field(() => Boolean)
  hide_from_nav: boolean;

  @Field(() => String, { nullable: true })
  parent_id?: string;

  @Field(() => String, { nullable: true })
  taxonomy_id?: string;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;

  @Field(() => Taxon, { nullable: true })
  parent?: Taxon;

  @Field(() => [Taxon], { nullable: true })
  children?: Taxon[];
}
