import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class MediaFilters {
    @Field(() => [String], { nullable: true })
    event_id?: string[] = [];
    @Field(() => [String], { nullable: true })
    place_id?: string[] = [];
    @Field(() => [String], { nullable: true })
    user_id?: string[] = [];
    @Field(() => [String], { nullable: true })
    mime_type?: string[] = [];
    @Field(() => [Boolean], { nullable: true })
    isCover?: boolean[] = [];
}