import { ArgsType, Field } from "@nestjs/graphql";
import { PlannerStatus } from "../enums/valid-status.enum";

@ArgsType()
export class PlannerStatusArgs {
    @Field(() => PlannerStatus, { nullable: true })
    status?: PlannerStatus;
}