import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavoriteInput } from './dto/create-favorite.input';
import { PrismaService } from '../prisma/prisma.service';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs } from '../common/pagination/args/pagination.args';
import { FavoritesResponse } from './dto/favorites-response.dto';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User, createFavoriteInput: CreateFavoriteInput): Promise<Favorite> {
    const data: any = {
      id_user: user.id,
    };

    if (createFavoriteInput.place_id) {
      data.place = {
        connect: { id: createFavoriteInput.place_id }
      };
    }

    if (createFavoriteInput.event_id) {
      data.event = {
        connect: { id: createFavoriteInput.event_id }
      };
    }

    const favorite = await this.prisma.favorites.create({
      data,
      include: {
        place: {
          include: {
            state: true,
            category: true,
            city: true,
            medias: { where: { isCover: true } }
          }
        },
        event: {
          include: {
            medias: { where: { isCover: true } },
            category: true
          }
        },
      }
    });

    return favorite as any;
  }

  async findAll(user: User, paginationArgs: PaginationArgs): Promise<FavoritesResponse> {
    const { current = 1 } = paginationArgs;
    const limit = 20; 
    const skip = (current - 1) * limit;

    const [favorites, totalCount] = await Promise.all([
      this.prisma.favorites.findMany({
        where: { id_user: user.id },
        skip,
        take: limit,
        include: {
          place: {
            include: {
              state: true,
              category: true,
              city: true,
              medias: { where: { isCover: true } }
            }
          },
          event: {
            include: {
              medias: { where: { isCover: true } },
              category: true
            }
          },
        },
        orderBy: { created_at: 'desc' }
      }),
      this.prisma.favorites.count({ where: { id_user: user.id } }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      info: {
        count: totalCount,
        pages: totalPages,
        next: current < totalPages ? current + 1 : undefined,
        prev: current > 1 ? current - 1 : undefined,
      },
      favorites: favorites as any,
    };
  }

  async findOne(user: User, id: string): Promise<Favorite> {
    const favorite = await this.prisma.favorites.findFirst({
      where: { id, id_user: user.id },
      include: {
        place: true,
        event: true,
      }
    });

    if (!favorite) {
      throw new NotFoundException(`Favorite with id ${id} not found`);
    }

    return favorite as any;
  }

  async remove(user: User, id: string): Promise<Favorite> {
    const favorite = await this.prisma.favorites.findFirst({
      where: { id, id_user: user.id }
    });

    if (!favorite) {
      throw new NotFoundException(`Favorite with id ${id} not found`);
    }

    const deleted = await this.prisma.favorites.delete({
      where: { id },
      include: {
        place: true,
        event: true,
      }
    });

    return deleted as any;
  }
}
