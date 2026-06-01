import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { PaginationArgs } from '../common/pagination/args/pagination.args';
import { EventsFilterArgs } from './args/events-filter.args';
import { EventsResponse } from './dto/events-response.dto';

@Resolver(() => Event)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Mutation(() => Event)
  createEvent(@Args('createEventInput') createEventInput: CreateEventInput) {
    return this.eventsService.create(createEventInput);
  }

  @Query(() => EventsResponse, { name: 'events' })
  findAll(
    @Args() eventsFilterArgs: EventsFilterArgs,
    @Args() paginationArgs: PaginationArgs,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    return this.eventsService.findAll(eventsFilterArgs, paginationArgs, limit);
  }

  @Query(() => Event, { name: 'event' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.eventsService.findOne(id);
  }

  @Mutation(() => Event)
  updateEvent(@Args('updateEventInput') updateEventInput: UpdateEventInput) {
    return this.eventsService.update(updateEventInput.id, updateEventInput);
  }

  @Mutation(() => Event)
  removeEvent(@Args('id', { type: () => String }) id: string) {
    return this.eventsService.remove(id);
  }
}
