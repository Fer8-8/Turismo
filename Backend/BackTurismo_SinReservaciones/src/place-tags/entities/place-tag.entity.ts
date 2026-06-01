import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { Place } from 'src/places/entities/place.entity';
import { Tag } from 'src/tags/entities/tag.entity';

@ObjectType()
export class PlaceTag {
  @Field(()=> ID)
  id: string
  
  @Field(()=> ID, { nullable: true })
  place_id: string | null
  
  @Field(()=> ID, { nullable: true })
  tag_id: string | null
  
  @Field(()=> Float)
  relevance_score: number | Prisma.Decimal

  @Field(() => Place, { nullable: true})
  Place?: Place | null

  @Field(() => Tag, { nullable: true})
  Tag?: Tag | null
}