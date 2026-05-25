import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class StockItem {
    @Field(() => ID)
    id: string;

    @Field(() => ID, { nullable: true })
    stock_location_id?: string | null;

    // @Field(() => String)
    // stockLocation: string

    @Field(() => ID, { nullable: true })
    variant_id?: string | null;

    // @Field(() => String)
    // variant: string

    @Field(() => Int)
    count_on_hand: number;

    @Field(() => Date)
    created_at: Date;

    @Field(() => Date)
    updated_at: Date;

    @Field(() => Boolean)
    backorderable: boolean

    @Field(() => Date, { nullable: true })
    deleted_at: Date | null;

    // @Field(() => String)
    // stockMovements: string

    // @Field(() => String)
    // stockReservations: string
}