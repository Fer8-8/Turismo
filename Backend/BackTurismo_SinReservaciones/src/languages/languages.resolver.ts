import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LanguagesService } from './languages.service';
import { Language } from './entities/language.entity';
import { CreateLanguageInput } from './dto/create-language.input';
import { UpdateLanguageInput } from './dto/update-language.input';

@Resolver(() => Language)
export class LanguagesResolver {
  constructor(private readonly languagesService: LanguagesService) {}

  @Mutation(() => Language)
  createLanguage(@Args('createLanguageInput') createLanguageInput: CreateLanguageInput) {
    return this.languagesService.create(createLanguageInput);
  }

  @Query(() => [Language], { name: 'languages' })
  findAll() {
    return this.languagesService.findAll();
  }

  @Query(() => Language, { name: 'language' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.languagesService.findOne(id);
  }

  @Mutation(() => Language)
  updateLanguage(@Args('updateLanguageInput') updateLanguageInput: UpdateLanguageInput) {
    return this.languagesService.update(updateLanguageInput.id, updateLanguageInput);
  }

  @Mutation(() => Language)
  removeLanguage(@Args('id', { type: () => String }) id: string) {
    return this.languagesService.remove(id);
  }
}
