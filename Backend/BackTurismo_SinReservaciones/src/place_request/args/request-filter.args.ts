import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsUUID, IsEnum, IsOptional } from 'class-validator';
import { request_status } from '../enums/status.enum';

@ArgsType()
export class PlaceRequestFilterArgs {
  @IsUUID()
  @IsOptional()
  @Field(() => [ID], { nullable: true })
  state_ids?: string[];

  @IsEnum(request_status)
  @IsOptional()
  @Field(() => request_status, { nullable: true })
  status?: request_status;
}
