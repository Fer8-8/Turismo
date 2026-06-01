import { InputType, Field, } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';
import { imageMetadata, videoMetadata } from '../interfaces';

@InputType()
export class CreateMediaInput {
  @Field({ nullable: true })
  @IsString()
  url?: string;

  @Field({ nullable: true })
  @IsString()
  mime_type?: string;

  @Field()
  @IsString()
  alt_text: string;

  @Field()
  @IsBoolean()
  isCover: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  event_id?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  place_id?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  place_activities_id?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  review_id?: string;

  // MUY IMPORTANTE: En el DTO debe ser opcional porque lo sacas del Token
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  user_id?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  metadata?: imageMetadata | videoMetadata | null;

  // Cámbialo a Opcional. El tamaño real lo sabrás hasta que el archivo esté en la nube

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  stream_url?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  miniature_url?: string;
  @IsNumber()
  size?: number;
}