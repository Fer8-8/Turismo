import { Injectable } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Event } from './entities/event.entity';
import { PaginationArgs } from 'src/common/pagination/args/pagination.args';
import { EventsFilterArgs } from './args/events-filter.args';
import { EventsResponse } from './dto/events-response.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventsService {

  constructor(private readonly prisma: PrismaService) { }

  async create(createEventInput: CreateEventInput): Promise<Event> {
    return await this.prisma.events.create({ data: createEventInput, include: { state: true } });
  }

  async findAll(
    filterArgs: EventsFilterArgs,
    paginationArgs: PaginationArgs,
    limit: number = 20
  ): Promise<EventsResponse> {
    const { id_state = [], id_category = [], start_date, end_date, is_active, mime_type = [], isCover = [] } = filterArgs;
    const { current = 1 } = paginationArgs;
    const skip = (current - 1) * limit;

    const where: Prisma.EventsWhereInput = {};

    if (id_state.length > 0) {
      where.id_state = { in: id_state };
    }

    if (id_category.length > 0) {
      where.id_category = { in: id_category };
    }

    if (start_date) {
      where.start_date = { gte: start_date };
    }
    if (end_date) {
      where.end_date = { lte: end_date };
    }

    if (is_active !== undefined) {
      const now = new Date();
      if (is_active) {
        where.end_date = { gte: now };
      } else {
        where.end_date = { lt: now };
      }
    }

    const mediaWhere: Prisma.mediaWhereInput = {};
    if (mime_type.length > 0) mediaWhere.mime_type = { in: mime_type };
    if (isCover.length === 1) mediaWhere.isCover = isCover[0];
    
    const mediasInclude = Object.keys(mediaWhere).length > 0 ? { where: mediaWhere } : true;

    const [events, totalCount] = await Promise.all([
      this.prisma.events.findMany({
        where,
        skip,
        take: limit,
        include: {
          state: true,
          category: true,
          medias: mediasInclude,
        },
      }),
      this.prisma.events.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      info: {
        count: totalCount,
        pages: totalPages,
        next: current < totalPages ? current + 1 : undefined,
        prev: current > 1 ? current - 1 : undefined,
      },
      events: events as any,
    };
  }

  async findOne(id: string): Promise<Event> {
    try {
      return await this.prisma.events.findUniqueOrThrow({
        where: { id },
        include: {
          state: true,
          category: true
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  update(id: string, updateEventInput: UpdateEventInput): Promise<Event> {
    return this.prisma.events.update({
      where: { id },
      data: updateEventInput,
      include: { state: true, category: true }
    });
  }

  remove(id: string) {
    return `This action removes a #${id} event`;
  }
}
