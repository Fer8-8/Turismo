import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsBoolean, IsInt, Min } from 'class-validator';

@InputType()
export class FilterUsersInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  login?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  role?: string;

  // si es true, solo usuarios activos (locked_at is null)
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  activeOnly?: boolean;
}

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number;

  @Field(() => Int, { defaultValue: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  take?: number;
}
