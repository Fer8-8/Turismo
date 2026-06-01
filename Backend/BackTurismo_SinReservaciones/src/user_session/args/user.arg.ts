import { ArgsType, Field, ID } from "@nestjs/graphql";
import { IsArray, IsOptional } from "class-validator";

@ArgsType()
export class ValidUserArgs {

    @Field( () => [ID], { nullable: true } )
    @IsArray()
    @IsOptional()
    user_ids: string[] = [];

}