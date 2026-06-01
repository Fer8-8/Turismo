import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Place } from '../places/entities/place.entity';
import { PlacesService } from '../places/places.service';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly placesService: PlacesService,
  ) {}

  @Mutation(() => Category)
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return this.categoriesService.create(createCategoryInput);
  }

  @Query(() => [Category], { name: 'categories' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Query(() => Category, { name: 'category' })
  findOne(@Args('id_category', { type: () => ID }) id_category: string) {
    return this.categoriesService.findOne(id_category);
  }

  @Mutation(() => Category)
  updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ) {
    return this.categoriesService.update(updateCategoryInput);
  }

  @Mutation(() => Category)
  removeCategory(
    @Args('id_category', { type: () => ID }) id_category: string,
  ) {
    return this.categoriesService.remove(id_category);
  }

  @ResolveField(() => [Place], { name: 'places' })
  async places(@Parent() category: Category) {
    return this.placesService.findByCategoryId(category.id_category);
  }
}
