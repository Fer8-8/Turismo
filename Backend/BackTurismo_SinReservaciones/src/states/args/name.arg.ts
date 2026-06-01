import { ArgsType, Field } from "@nestjs/graphql";
import { IsArray } from "class-validator";

@ArgsType()
export class ValidNameArgs {
    
    @Field( () => [String], { nullable: true } )
    @IsArray()
    name: string[] = []

}