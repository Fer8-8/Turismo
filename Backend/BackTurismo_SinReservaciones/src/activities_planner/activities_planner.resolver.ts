import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ActivitiesPlannerService } from './activities_planner.service';
import { ActivitiesPlanner } from './entities/activities_planner.entity';
import { CreateActivitiesPlannerInput } from './dto/create-activities_planner.input';
import { UpdateActivitiesPlannerInput } from './dto/update-activities_planner.input';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ValidActivityArgs } from './args/activity.arg';
import { PaginationArgs } from 'src/common/pagination/args/pagination.args';
import { ActivitiesPlannerResponse } from './dto/activities_planner-response.dto';

@Resolver(() => ActivitiesPlanner)
export class ActivitiesPlannerResolver {
  constructor(private readonly activitiesPlannerService: ActivitiesPlannerService) {}

  @AllowAnonymous()
  @Mutation(() => ActivitiesPlanner)
  createActivitiesPlanner(@Args('createActivitiesPlannerInput') createActivitiesPlannerInput: CreateActivitiesPlannerInput): Promise<ActivitiesPlanner> {
    return this.activitiesPlannerService.create(createActivitiesPlannerInput);
  }

  @AllowAnonymous()
  @Query(() => ActivitiesPlannerResponse, { name: 'activitiesPlanner' })
  findAll(
    @Args() ValidActivityArgs: ValidActivityArgs,
    @Args() paginationArgs: PaginationArgs
  ): Promise<ActivitiesPlannerResponse> {
    return this.activitiesPlannerService.findAll(
      ValidActivityArgs.activities_ids,
      paginationArgs
    );
  }

  @AllowAnonymous()
  @Query(() => ActivitiesPlanner, { name: 'activityPlanner' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.activitiesPlannerService.findOne(id);
  }

  @AllowAnonymous()
  @Mutation(() => ActivitiesPlanner)
  updateActivitiesPlanner(@Args('updateActivitiesPlannerInput') updateActivitiesPlannerInput: UpdateActivitiesPlannerInput) {
    return this.activitiesPlannerService.update(updateActivitiesPlannerInput.id, updateActivitiesPlannerInput);
  }

  // @Mutation(() => ActivitiesPlanner)
  // removeActivitiesPlanner(@Args('id', { type: () => Int }) id: number) {
  //   return this.activitiesPlannerService.remove(id);
  // }
}
