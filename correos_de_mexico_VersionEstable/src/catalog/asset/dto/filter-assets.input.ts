import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsBoolean, IsUUID, IsEnum } from 'class-validator';
import { AssetKind } from '../enums/asset-kind.enum';

@InputType()
export class FilterAssetsInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  viewable_type?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID()
  viewable_id?: string;

  @Field(() => AssetKind, { nullable: true })
  @IsOptional()
  @IsEnum(AssetKind)
  type?: AssetKind;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  includeDeleted?: boolean;
}
