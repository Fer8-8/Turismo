import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlaceInput } from './dto/create-place.input';
import { UpdatePlaceInput } from './dto/update-place.input';
import { PaginationArgs } from '../common/pagination/args/pagination.args';
import { PlacesResponse } from './dto/places-response.dto';
import { PlacesFilterArgs } from './args/places-filter.args';
import { Place } from './entities/place.entity';
import { ValidRegionsArgs } from 'src/states/args/regions.arg';
import { ValidLocationArgs } from './args/location.args';
import { User } from 'src/users/entities/user.entity';
import { Prisma, Role } from '@prisma/client';
import { shuffleArray } from '../common/utils/random.util';

@Injectable()
export class PlacesService {
  constructor(private prisma: PrismaService) { }

  async create(
    user: User,
    createPlaceInput: CreatePlaceInput,
    tx: Prisma.TransactionClient = this.prisma
  ): Promise<Place> {
    if (createPlaceInput.state_id) {
      if (user.role === Role.adminState && createPlaceInput.state_id !== user.managedStateId) {
        throw new ForbiddenException("You are not authorized to create a place in this state");
      }
    }

    return tx.places.create({
      data: createPlaceInput as any,
      include: {
        state: true,
        category: true,
        city: true,
        placeAttributes: true,
        placeTags: {
          include: {
            Tag: true
          }
        },
      }
    })
  }

  async findAll(
    filterArgs: PlacesFilterArgs,
    paginationArgs: PaginationArgs,
    validRegionsArgs: ValidRegionsArgs,
    limit: number = 20,
    isRandom: boolean = false,
    seed?: number,
  ): Promise<PlacesResponse> {
    const { id_category = [], state_id = [], name, mime_type = [], isCover = [] } = filterArgs;
    const { current = 1 } = paginationArgs;
    const { regions = [] } = validRegionsArgs;
    const skip = (current - 1) * limit;

    const where: any = {};

    if (id_category.length > 0) {
      where.id_category = { in: id_category };
    }

    if (state_id.length > 0) {
      where.state_id = { in: state_id };
    }

    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }

    if (regions.length > 0) {
      where.state = {
        region: { in: regions },
      };
    }

    const mediaWhere: Prisma.mediaWhereInput = {};
    if (mime_type.length > 0) mediaWhere.mime_type = { in: mime_type };
    if (isCover.length === 1) mediaWhere.isCover = isCover[0];
    
    const mediasInclude = Object.keys(mediaWhere).length > 0 ? { where: mediaWhere } : true;

    let places;
    let totalCount;

    if (isRandom) {
      totalCount = await this.prisma.places.count({ where });

      const allIds = await this.prisma.places.findMany({
        where,
        select: { id: true }
      });

      const seedValue = seed ?? Math.floor(Math.random() * 1000000);
      const shuffledIds = shuffleArray(allIds.map((p) => p.id), seedValue);
      const pagedIds = shuffledIds.slice(skip, skip + limit);

      places = await this.prisma.places.findMany({
        where: { id: { in: pagedIds } },
        include: {
          state: true,
          category: true,
          city: true,
          placeAttributes: true,
          placeTags: {
            include: {
              Tag: true
            }
          },
          medias: mediasInclude
        },
      });

      // Maintain random order
      places.sort((a, b) => pagedIds.indexOf(a.id) - pagedIds.indexOf(b.id));
    } else {
      [places, totalCount] = await Promise.all([
        this.prisma.places.findMany({
          where,
          skip,
          take: limit,
          include: {
            state: true,
            category: true,
            city: true,
            placeAttributes: true,
            placeTags: {
              include: {
                Tag: true
              }
            },
            medias: mediasInclude
          },
        }),
        this.prisma.places.count({ where }),
      ]);
    }

    const totalPages = Math.ceil(totalCount / limit);

    return {
      info: {
        count: totalCount,
        pages: totalPages,
        next: current < totalPages ? current + 1 : undefined,
        prev: current > 1 ? current - 1 : undefined,
      },
      places,
    };
  }

  async findOne(id: string): Promise<Place> {
    try {
      return this.prisma.places.findUniqueOrThrow({
        where: { id },
        include: {
          state: true,
          category: true,
          city: true,
          placeAttributes: true,
          placeTags: {
            include: {
              Tag: true
            }
          }
        }
      })
    } catch (err) {
      throw new Error(err)
    }
  }

  async update(user: User, id: string, updatePlaceInput: UpdatePlaceInput): Promise<Place> {
    const place = await this.prisma.places.findUniqueOrThrow({
      where: { id }
    });

    if (user.role === Role.adminState && place.state_id !== user.managedStateId) {
      throw new ForbiddenException("You are not authorized to edit places from another state");
    }

    if (updatePlaceInput.state_id && user.role === Role.adminState
      && updatePlaceInput.state_id !== user.managedStateId
    ) {
      throw new ForbiddenException("You are not authorized to update this field");
    }

    return this.prisma.places.update({
      where: { id },
      data: updatePlaceInput,
      include: {
        state: true,
        category: true,
        city: true,
        placeAttributes: true,
      }
    });
  }

  async remove(id: string): Promise<Place> {
    return this.prisma.places.delete({
      where: { id },
      include: {
        state: true,
        category: true,
        city: true,
        placeAttributes: true,
      }
    })
  }

  async findByCategoryId(id_category: string): Promise<Place[]> {
    return this.prisma.places.findMany({
      where: { id_category },
      include: {
        state: true,
        category: true,
        city: true,
        placeAttributes: true,
        placeTags: {
          include: {
            Tag: true
          }
        }
      }
    })
  }

  async findNearby(
    args: ValidLocationArgs,
    paginationArgs: PaginationArgs,
    filterArgs: PlacesFilterArgs = {},
    limit: number = 20
  ): Promise<PlacesResponse> {
    const { latitude, longitude } = args;
    const { current = 1 } = paginationArgs;
    const skip = (current - 1) * limit;

    const { id_category = [], state_id = [], name, mime_type = [], isCover = [] } = filterArgs;

    const conditions: Prisma.Sql[] = [
      Prisma.sql`latitude IS NOT NULL`,
      Prisma.sql`longitude IS NOT NULL`
    ];

    if (id_category.length > 0) {
      conditions.push(Prisma.sql`id_category IN (${Prisma.join(id_category)})`);
    }

    if (state_id.length > 0) {
      conditions.push(Prisma.sql`state_id IN (${Prisma.join(state_id)})`);
    }

    if (name) {
      conditions.push(Prisma.sql`name ILIKE ${'%' + name + '%'}`);
    }

    const whereClause = Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`;

    const rawResults = await this.prisma.$queryRaw<{ id: string; distance: number, full_count: number }[]>`
      WITH all_places AS (
        SELECT id, latitude::float as lat, longitude::float as lng
        FROM places
        ${whereClause}
      ),
      with_distance AS (
        SELECT id,
          6371 * acos(
            LEAST(1.0,
              cos(radians(${latitude})) * cos(radians(lat))
              * cos(radians(lng) - radians(${longitude}))
              + sin(radians(${latitude})) * sin(radians(lat))
            )
          ) AS distance
        FROM all_places
      )
      SELECT id, distance, COUNT(*) OVER() AS full_count
      FROM with_distance
      ORDER BY distance ASC
      LIMIT ${limit} OFFSET ${skip};
    `;

    if (rawResults.length === 0) {
      return {
        info: { count: 0, pages: 0, next: undefined, prev: undefined },
        places: [],
      };
    }

    const totalCount = Number(rawResults[0].full_count);
    const totalPages = Math.ceil(totalCount / limit);
    const ids = rawResults.map(r => r.id);

    const mediaWhere: Prisma.mediaWhereInput = {};
    if (mime_type.length > 0) mediaWhere.mime_type = { in: mime_type };
    if (isCover.length === 1) mediaWhere.isCover = isCover[0];
    
    const mediasInclude = Object.keys(mediaWhere).length > 0 ? { where: mediaWhere } : true;

    const places = await this.prisma.places.findMany({
      where: { id: { in: ids } },
      include: {
        state: true,
        category: true,
        city: true,
        placeAttributes: true,
        placeTags: { include: { Tag: true } },
        medias: mediasInclude,
      },
    });

    const distanceMap = new Map(rawResults.map(r => [r.id, r.distance]));
    const placesWithDistance = ids.map(id => {
      const place = places.find(p => p.id === id);
      return {
        ...place,
        distance: parseFloat((distanceMap.get(id) ?? 0).toFixed(2)),
      };
    });

    return {
      info: {
        count: totalCount,
        pages: totalPages,
        next: current < totalPages ? current + 1 : undefined,
        prev: current > 1 ? current - 1 : undefined,
      },
      places: placesWithDistance as Place[],
    };
  }

  async findCities(state_id?: string): Promise<Place[]> {
    return this.prisma.places.findMany({
      where: {
        id_category: '33eba4b8-36ed-46d0-803a-e0e71f32ae5c',
        ...(state_id && { state_id })
      },
      include: {
        state: true,
        category: true,
        city: true,
        places: true,
        placeAttributes: true,
        placeTags: {
          include: {
            Tag: true
          }
        }
      }
    });
  }
}
