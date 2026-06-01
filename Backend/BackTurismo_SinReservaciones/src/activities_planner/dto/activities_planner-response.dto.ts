import { Field, ObjectType } from "@nestjs/graphql";
import { Info } from "src/common/pagination/models/info.model";
import { ActivitiesPlanner } from "../entities/activities_planner.entity";

@ObjectType()
export class ActivitiesPlannerResponse {
    @Field(() => Info)
    info: Info;

    @Field(() => [ActivitiesPlanner])
    activities_planners: ActivitiesPlanner[];
}