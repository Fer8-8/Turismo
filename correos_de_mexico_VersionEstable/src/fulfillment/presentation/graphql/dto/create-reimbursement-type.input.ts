import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ReimbursementTypeKind } from '../../../domain/enums/reimbursement-type-kind.enum';

@InputType()
export class CreateReimbursementTypeInput {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  mutable?: boolean;

  @Field(() => ReimbursementTypeKind, { nullable: true })
  @IsOptional()
  type?: ReimbursementTypeKind;
}
