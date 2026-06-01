import { Field, GraphQLISODateTime, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";

@ObjectType()
export class ChangeElement {
    @Field(() => String, { description: "Name of the field changed" })
    field: string;

    @Field(() => GraphQLJSON, { nullable: true })
    old_value?: any;

    @Field(() => GraphQLJSON, { nullable: true })
    new_value?: any;
}

@ObjectType()
export class RequestHistoryEntry {
    @Field(() => GraphQLISODateTime, { description: "Update date" })
    changed_at: Date;

    @Field(() => [ChangeElement], { description: "Changes made in update" })
    changes: ChangeElement[];
}
