import { Injectable } from '@nestjs/common';
import { CreatePlacefeaturecacheInput } from './dto/create-placefeaturecache.input';
import { UpdatePlacefeaturecacheInput } from './dto/update-placefeaturecache.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Placefeaturecache } from './entities/placefeaturecache.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class PlacefeaturecacheService {

  constructor(private prisma: PrismaService) {}

   async create(createPlacefeaturecacheInput: CreatePlacefeaturecacheInput): Promise<Placefeaturecache> {
    return this.prisma.placeFeaturesCache.create({
      data: createPlacefeaturecacheInput,
      include: {
        Place: true,
      },
    });
  }

 async findAll(
    categoryId?: string, 
    stateId?: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<Placefeaturecache[]> {
    const skip = (page - 1) * limit;

    const where: Prisma.PlaceFeaturesCacheWhereInput = {};
    
    if (categoryId || stateId) {
      where.Place = {
        ...(categoryId && { id_category: categoryId }),
        ...(stateId && { state_id: stateId }),
      };
    }

    return this.prisma.placeFeaturesCache.findMany({
      where,
      include: {
        Place: true,
      },
      skip,
      take: limit,
    });
  }

  async findOne(id: string): Promise<Placefeaturecache> {
    try{
      return await this.prisma.placeFeaturesCache.findUniqueOrThrow({
        where: { id },
        include: {
          Place: true,
        },
      });
    }catch(err){
      throw new Error(err);
    }
  }

  async update(id: string, updatePlacefeaturecacheInput: UpdatePlacefeaturecacheInput): Promise<Placefeaturecache> {
    try{
      return await this.prisma.placeFeaturesCache.update({
        where: { id },
        data: updatePlacefeaturecacheInput,
        include: {
          Place: true,
        },
      });
    }catch(err){
      throw new Error(err);
    }
  }

  // async remove(id: string): Promise<Placefeaturecache> {
  //   try{
  //     return await this.prisma.placeFeaturesCache.delete({
  //       where: { id },
  //     });
  //   }catch(err){
  //     throw new Error(err);
  //   }
  // }
}
