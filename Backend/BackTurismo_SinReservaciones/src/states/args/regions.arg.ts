import { ArgsType, Field } from "@nestjs/graphql";
import { IsArray } from "class-validator";
import { ValidRegions } from "../enums/valid-regions.enum";

@ArgsType()
export class ValidRegionsArgs {
    
    @Field( () => [ValidRegions], { nullable: true } )
    @IsArray()
    regions: ValidRegions[] = []
}