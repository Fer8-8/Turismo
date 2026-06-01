import { Field, ObjectType } from "@nestjs/graphql";
import { Info } from "src/common/pagination/models/info.model";
import { PlaceRequest } from "../entities/place_request.entity";

@ObjectType()
export class PlaceRequestResponse {
    @Field(() => Info)
    info: Info;

    @Field(() => [PlaceRequest])
    place_requests: PlaceRequest[];
}
