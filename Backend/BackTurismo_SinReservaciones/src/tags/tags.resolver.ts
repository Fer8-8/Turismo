import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TagsService } from './tags.service';
import { Tag } from './entities/tag.entity';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';

@Resolver(() => Tag)
export class TagsResolver {
  constructor(private readonly tagsService: TagsService) {}

  @Mutation(() => Tag)
  createTag(@Args('createTagInput') createTagInput: CreateTagInput): Promise<Tag> {
    return this.tagsService.create(createTagInput);
  }

  @Query(() => [Tag], { name: 'tags' })
  findAll(): Promise<Tag[]> {
    return this.tagsService.findAll();
  }

  @Query(() => Tag, { name: 'tag' })
  findOne(@Args('id', { type: () => ID }) id: string): Promise<Tag> {
    return this.tagsService.findOne(id);
  }

  @Mutation(() => Tag)
  updateTag(@Args('updateTagInput') updateTagInput: UpdateTagInput): Promise<Tag> {
    return this.tagsService.update(updateTagInput.id, updateTagInput);
  }

  // @Mutation(() => Tag)
  // removeTag(@Args('id', { type: () => ID }) id: string): Promise<Tag> {
  //   return this.tagsService.remove(id);
  // }
}
