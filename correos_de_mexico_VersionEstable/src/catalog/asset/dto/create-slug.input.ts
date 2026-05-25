import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUUID,
  MaxLength,
  Matches,
} from 'class-validator';

@InputType()
export class CreateSlugInput {
  @Field(() => String)
  @IsString()
  @MaxLength(255, { message: 'slug no puede exceder 255 caracteres' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug solo puede contener letras minúsculas, números y guiones',
  })
  slug: string;

  @Field(() => String)
  @IsString()
  sluggable_type: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID()
  sluggable_id?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  scope?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  is_primary?: boolean;
}
