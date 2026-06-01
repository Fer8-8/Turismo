import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { StatesService } from './states.service';
import { State } from './entities/state.entity';
import { CreateStateInput } from './dto/create-state.input';
import { UpdateStateInput } from './dto/update-state.input';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ValidRegionsArgs } from './args/regions.arg';
import { ValidNameArgs } from './args/name.arg'

@Resolver(() => State)

export class StatesResolver {
  constructor(private readonly statesService: StatesService) {}

  @AllowAnonymous()
  @Mutation(() => State)
  createState(@Args('createStateInput') createStateInput: CreateStateInput): Promise<State> {
    return this.statesService.create(createStateInput);
  }

  @AllowAnonymous()
  @Query(() => [State], { name: 'states' })
  findAll(
    @Args() validRegionsArgs: ValidRegionsArgs,
    @Args() validNameArgs: ValidNameArgs
  ): Promise<State[]> {
    return this.statesService.findAll(
      validRegionsArgs.regions, 
      validNameArgs.name
    );
  }

  @AllowAnonymous()
  @Query(() => State, { name: 'state' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.statesService.findOne(id);
  }

  @Mutation(() => State)
  updateState(@Args('updateStateInput') updateStateInput: UpdateStateInput) {
    return this.statesService.update(updateStateInput.id, updateStateInput);
  }

  // @AllowAnonymous()
  // @Mutation(() => State)
  // removeState(@Args('id', { type: () => ID }) id: string) {
  //   return this.statesService.remove(id);
  // }
}
