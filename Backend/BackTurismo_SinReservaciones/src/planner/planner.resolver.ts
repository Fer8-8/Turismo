import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PlannerService } from './planner.service';
import { Planner } from './entities/planner.entity';
import { CreatePlannerInput } from './dto/create-planner.input';
import { UpdatePlannerInput } from './dto/update-planner.input';
import { PlannerResponse } from './dto/planner-response.dto';
import { PlannerStatus } from './enums/valid-status.enum';
import { PaginationArgs } from 'src/common/pagination/args/pagination.args';

@Resolver(() => Planner)
export class PlannerResolver {
  constructor(private readonly plannerService: PlannerService) {}

  @Mutation(() => Planner)
  createPlanner(@Args('createPlannerInput') createPlannerInput: CreatePlannerInput) {
    return this.plannerService.create(createPlannerInput);
  }

  @Query(() => PlannerResponse, { name: 'planners' })
  findAll(
    @Args('status', { type: () => PlannerStatus, nullable: true }) status: PlannerStatus,
    @Args() paginationArgs: PaginationArgs
  ) : Promise<PlannerResponse> {
    return this.plannerService.findAll(status, paginationArgs);

  }

  @Query(() => Planner, { name: 'planner' })
  findOne(@Args('id', { type: () => String }) id: string) : Promise<Planner> {
    return this.plannerService.findOne(id);
  }

  @Mutation(() => Planner)
  updatePlanner(@Args('updatePlannerInput') updatePlannerInput: UpdatePlannerInput) : Promise<Planner> {
    return this.plannerService.update(updatePlannerInput.id, updatePlannerInput);
  }

  /*
  @Mutation(() => Planner)
  removePlanner(@Args('id', { type: () => String }) id: string) : Promise<Planner>  {
    return this.plannerService.remove(id);
  }
  */
}
 
