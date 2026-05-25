import { InputType, Field } from '@nestjs/graphql';
import { IsString, MinLength, MaxLength, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class CreatePropertyInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @Field(() => String)
  @IsString()
  @MinLength(1, { message: 'presentation es requerido' })
  @MaxLength(255)
  presentation: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  filterable?: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  filter_param?: string;
}
