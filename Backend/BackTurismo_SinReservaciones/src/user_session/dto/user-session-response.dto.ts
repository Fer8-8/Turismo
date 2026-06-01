import { Field, ObjectType } from "@nestjs/graphql";
import { Info } from "src/common/pagination/models/info.model";
import { UserSession } from "../entities/user_session.entity";

@ObjectType()
export class UserSessionResponse {
    @Field(() => Info)
    info: Info;

    @Field(() => [UserSession])
    user_sessions: UserSession[];
}
