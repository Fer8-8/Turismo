import { InputType, ID, Field, Float } from '@nestjs/graphql';
import { Prisma } from "@prisma/client"

@InputType()
export class CreatePlaceTagInput {
    @Field(()=> ID)
    place_id: string
    
    @Field(()=> ID)
    tag_id: string
    
    @Field(()=> Float)
    relevance_score: number | Prisma.Decimal
}
