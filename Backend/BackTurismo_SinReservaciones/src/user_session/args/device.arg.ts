import { ArgsType, Field, ID } from "@nestjs/graphql";
import { IsArray, IsOptional } from "class-validator";
import { device_types } from "../enums/device_types.enum";

@ArgsType()
export class ValidDeviceArgs {

    @Field( () => [device_types], { nullable: true } )
    @IsArray()
    @IsOptional()
    device_types: device_types[] = [];
    
}