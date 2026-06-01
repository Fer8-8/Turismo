import { Field, ArgsType } from '@nestjs/graphql';
import { IsNumber, Min, Max } from 'class-validator';

@ArgsType()
export class ValidLocationArgs {
  @IsNumber()
  @Min(-90) @Max(90)
  @Field(() => Number, { description: "The latitude coordinate in decimal degrees (e.g., 19.4326)" })
  latitude: number;
  
  @IsNumber()
  @Min(-180) @Max(180)
  @Field(() => Number, { description: "The longitude coordinate in decimal degrees (e.g., -99.1332)" })
  longitude: number;

}
