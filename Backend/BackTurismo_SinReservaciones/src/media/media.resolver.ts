import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MediaService } from './media.service';
import { Media } from './entities/media.entity';
import { CreateMediaInput } from './dto/create-media.input';
import { UpdateMediaInput } from './dto/update-media.input';
import { MediaFilters } from './args/media-filters.args';
import { MediaResponse } from './dto/media-response.dto';
import { PaginationArgs } from 'src/common/pagination/args/pagination.args';
import { StorageService } from 'src/storage/storage.service';
import { GraphQLUpload, FileUpload } from 'graphql-upload-ts';
import { Body, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@AllowAnonymous()
@Resolver(() => Media)
export class MediaResolver {
  constructor(
    private readonly mediaService: MediaService,
  ) { }


  //Create Media File mutation not in use, migrated to REST, see media.controller.ts for such.
  
  // @Mutation(() => Media)
  // createMedia(
  //   @Args('createMediaInput') createMediaInput: CreateMediaInput, 
  //   @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
  // ) : Promise<Media> {
  //   return this.mediaService.create(createMediaInput, file);
  // }

  @Query(() => MediaResponse, { name: 'allMedia' })
  findAll(
    @Args() filters: MediaFilters,
    @Args() paginationArgs: PaginationArgs,
    @Args('isRandom', { type: () => Boolean, nullable: true }) isRandom?: boolean,
    @Args('seed', { type: () => Int, nullable: true }) seed?: number,
  ): Promise<MediaResponse> {
    return this.mediaService.findAll(filters, paginationArgs, isRandom, seed);
  }

  @Query(() => Media, { name: 'media' })
  findOne(@Args('id', { type: () => String }) id: string): Promise<Media> {
    return this.mediaService.findOne(id);
  }

  @Mutation(() => Media)
  updateMedia(@Args('updateMediaInput') updateMediaInput: UpdateMediaInput): Promise<Media> {
    return this.mediaService.update(updateMediaInput.id, updateMediaInput);
  }

}
