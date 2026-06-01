import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivitiesPlannerInput } from './dto/create-activities_planner.input';
import { UpdateActivitiesPlannerInput } from './dto/update-activities_planner.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivitiesPlanner } from './entities/activities_planner.entity';
import { PaginationArgs } from 'src/common/pagination/args/pagination.args';
import { ActivitiesPlannerResponse } from './dto/activities_planner-response.dto';

@Injectable()
export class ActivitiesPlannerService {
  constructor(private prisma: PrismaService) {}

  async create(createActivitiesPlannerInput: CreateActivitiesPlannerInput): Promise<ActivitiesPlanner> {
    return this.prisma.activities_planner.create({
      data: this.mapToPrismaCreate(createActivitiesPlannerInput),
      include: {
        planner: true,
        places: true,
      }
    });
  }

  async findAll(
    activities_ids: string[],
    paginationArgs: PaginationArgs
  ): Promise<ActivitiesPlannerResponse> {
    const { current = 1 } = paginationArgs;
    const limit = 20;
    const skip = (current - 1) * limit;

    const where: any = {};
    if (activities_ids && activities_ids.length > 0) where.id = { in: activities_ids };

    const [ activities_planners, totalCount ] = await Promise.all([
      this.prisma.activities_planner.findMany({
        where,
        skip,
        take: limit,
        orderBy: { day: 'desc' },
        include: {
          planner: true,
          places: true,
        }
      }),
      this.prisma.activities_planner.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      info: {
        count: totalCount,
        pages: totalPages,
        next: current < totalPages ? current + 1 : undefined,
        prev: current > 1 ? current - 1 : undefined,
      },
      activities_planners,
    };
  }

  async findOne(id: string): Promise<ActivitiesPlanner> {
    try {
      return await this.prisma.activities_planner.findUniqueOrThrow({
        where: { id },
        include: {
          planner: true,
          places: true,
        }
      });

    } catch (e) {
      throw new NotFoundException("Activities planner not found");
    }
  }

  async update(id: string, updateActivitiesPlannerInput: UpdateActivitiesPlannerInput): Promise<ActivitiesPlanner> {
    return this.prisma.activities_planner.update({
      where: { id },
      data: this.mapToPrismaUpdate(updateActivitiesPlannerInput),
      include: {
        planner: true,
        places: true,
      }
    });
  }

  // remove(id: number) {
  //   return `This action removes a #${id} activitiesPlanner`;
  // }

  private mapToPrismaCreate(input: CreateActivitiesPlannerInput) {
    const { id_places, ...rest } = input;

    return {
      ...rest,
      places: id_places?.length
        ? { connect: id_places.map((id) => ({ id })) }
        : undefined,
    }
  }

  private mapToPrismaUpdate(input: UpdateActivitiesPlannerInput) {
    const { id_places, id, ...rest } = input;

    return {
      ...rest,
      places: id_places
        ? { set: id_places.map((id) => ({ id })) }
        : undefined,
    }
  }
}
