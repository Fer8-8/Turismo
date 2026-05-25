import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { AssetKind } from '../enums/asset-kind.enum';

@ObjectType()
export class Asset {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  attachment_file_name?: string;

  @Field(() => String, { nullable: true })
  attachment_content_type?: string;

  @Field(() => Int, { nullable: true })
  attachment_file_size?: number;

  @Field(() => Int, { nullable: true })
  attachment_width?: number;

  @Field(() => Int, { nullable: true })
  attachment_height?: number;

  @Field(() => String, { nullable: true })
  alt?: string;

  @Field(() => Int, { nullable: true })
  position?: number;

  @Field(() => String, { nullable: true })
  viewable_type?: string;

  @Field(() => String, { nullable: true })
  viewable_id?: string;

  @Field(() => AssetKind, { nullable: true })
  type?: AssetKind;

  @Field(() => Date, { nullable: true })
  deleted_at?: Date;

  @Field(() => Date, { nullable: true })
  attachment_updated_at?: Date;

  @Field(() => Date, { nullable: true })
  created_at?: Date;

  @Field(() => Date, { nullable: true })
  updated_at?: Date;
}
