import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { AssetKind } from '../enums/asset-kind.enum';

@InputType()
export class CreateAssetInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'attachment_file_name no puede exceder 255 caracteres' })
  attachment_file_name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'attachment_content_type no puede exceder 100 caracteres' })
  attachment_content_type?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  attachment_file_size?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  attachment_width?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  attachment_height?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'alt no puede exceder 500 caracteres' })
  alt?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;

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
}
