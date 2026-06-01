import { ArgsType, Field, ID } from "@nestjs/graphql";
import { IsArray, IsOptional } from "class-validator";

@ArgsType()
export class ValidActivityArgs {

    @Field( () => [ID], { nullable: true } )
    @IsArray()
    @IsOptional()
    activities_ids: string[] = [];

}