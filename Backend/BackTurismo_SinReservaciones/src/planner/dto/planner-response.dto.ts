import { ObjectType, Field } from "@nestjs/graphql";
import { Planner } from "../entities/planner.entity";
import { Info } from "src/common/pagination/models/info.model";

@ObjectType()
export class PlannerResponse {
    @Field(() => Info)
    info: Info;

    @Field(() => [Planner])
    planners: Planner[];
}