import { CreateMediaInput } from './create-media.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { MediaStatus } from '../entities/media.entity';

@InputType()
export class UpdateMediaInput extends PartialType(CreateMediaInput) {
  @Field(() => String)
  @IsString()
  id: string;

  @Field(() => MediaStatus, { nullable: true })
  @IsOptional()
  @IsEnum(MediaStatus)
  status?: MediaStatus;
}
