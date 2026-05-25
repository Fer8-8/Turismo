import { InputType, Field, ID, Int } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateAssetInput } from './create-asset.input';

@InputType()
export class UpdateAssetInput extends PartialType(CreateAssetInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
