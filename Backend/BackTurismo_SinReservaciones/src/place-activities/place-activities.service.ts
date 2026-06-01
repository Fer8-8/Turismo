import { Injectable } from '@nestjs/common';
import { CreatePlaceActivityInput } from './dto/create-place-activity.input';
import { UpdatePlaceActivityInput } from './dto/update-place-activity.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlaceActivity } from './entities/place-activity.entity';
import { PaginationArgs } from 'src/common/pagination/args/pagination.args';
import { PlaceActivitiesResponse } from './dto/place-activities-response.dto';
import { PlaceActivitiesFilterArgs } from './args/place-activities-filter.args';

@Injectable()
export class PlaceActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPlaceActivityInput: CreatePlaceActivityInput) {
    return this.prisma.placeActivities.create({
      data: createPlaceActivityInput,
      include: { Place: true },
    });
  }

  async findAll(
    paginationArgs: PaginationArgs,
    filterArgs?: PlaceActivitiesFilterArgs
  ): Promise<PlaceActivitiesResponse> {
    const { current = 1 } = paginationArgs;
    const limit = 20;
    const skip = (current - 1) * limit;

    const mime_type = filterArgs?.mime_type || [];
    const isCover = filterArgs?.isCover || [];

    const mediaWhere: any = {};
    if (mime_type.length > 0) mediaWhere.mime_type = { in: mime_type };
    if (isCover.length === 1) mediaWhere.isCover = isCover[0];
    
    const mediasInclude = Object.keys(mediaWhere).length > 0 ? { where: mediaWhere } : true;

    const [placeActivities, totalCount] = await Promise.all([
      this.prisma.placeActivities.findMany({
        skip,
        take: limit,
        include: { Place: true, media: mediasInclude },
      }),
      this.prisma.placeActivities.count(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      info: {
        count: totalCount,
        pages: totalPages,
        next: current < totalPages ? current + 1 : undefined,
        prev: current > 1 ? current - 1 : undefined,
      },
      placeActivities: placeActivities as any,
    };
  }

  async findOne(id: string): Promise<PlaceActivity> {
    return await this.prisma.placeActivities.findUniqueOrThrow({
      where: { id },
      include: { Place: true },
    });
  }

  async update(id: string, updatePlaceActivityInput: UpdatePlaceActivityInput): Promise<PlaceActivity> {
    return await this.prisma.placeActivities.update({
      where: { id },
      data: updatePlaceActivityInput,
      include: { Place: true },
    });
  }

  async findByPlaceId(
    placeId: string,
    paginationArgs: PaginationArgs,
    filterArgs?: PlaceActivitiesFilterArgs
  ): Promise<PlaceActivitiesResponse> {
    const { current = 1 } = paginationArgs;
    const limit = 20;
    const skip = (current - 1) * limit;
    const where = { place_id: placeId };

    const mime_type = filterArgs?.mime_type || [];
    const isCover = filterArgs?.isCover || [];

    const mediaWhere: any = {};
    if (mime_type.length > 0) mediaWhere.mime_type = { in: mime_type };
    if (isCover.length === 1) mediaWhere.isCover = isCover[0];
    
    const mediasInclude = Object.keys(mediaWhere).length > 0 ? { where: mediaWhere } : true;

    const [placeActivities, totalCount] = await Promise.all([
      this.prisma.placeActivities.findMany({
        where,
        skip,
        take: limit,
        include: { Place: true, media: mediasInclude },
      }),
      this.prisma.placeActivities.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      info: {
        count: totalCount,
        pages: totalPages,
        next: current < totalPages ? current + 1 : undefined,
        prev: current > 1 ? current - 1 : undefined,
      },
      placeActivities: placeActivities as any,
    };
  }

  remove(id: string) {
    return `This action removes a #${id} placeActivity`;
  }
}
