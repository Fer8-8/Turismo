import { Injectable } from '@nestjs/common';
import { CreateUserfeaturescacheInput } from './dto/create-userfeaturescache.input';
import { UpdateUserfeaturescacheInput } from './dto/update-userfeaturescache.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Userfeaturescache } from './entities/userfeaturescache.entity';
import { PaginationArgs } from 'src/common/pagination/args/pagination.args';
import { UserfeaturescacheResponse } from './dto/userfeaturescache-response.dto';

@Injectable()
export class UserfeaturescacheService {
  constructor(private prisma: PrismaService) {}
  create(createUserfeaturescacheInput: CreateUserfeaturescacheInput): Promise<Userfeaturescache> {
    return this.prisma.userFeaturesCache.create({ data: createUserfeaturescacheInput, include: { User: true } });
  }

  async findAll(paginationArgs: PaginationArgs): Promise<UserfeaturescacheResponse> {
    const { current = 1 } = paginationArgs;
    const limit = 20;
    const skip = (current - 1) * limit;

    const [userfeaturescaches, totalCount] = await Promise.all([
      this.prisma.userFeaturesCache.findMany({
        skip,
        take: limit,
        include: { User: true }
      }),
      this.prisma.userFeaturesCache.count(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      info: {
        count: totalCount,
        pages: totalPages,
        next: current < totalPages ? current + 1 : undefined,
        prev: current > 1 ? current - 1 : undefined,
      },
      userfeaturescaches,
    };
  }

  findOne(id: string): Promise<Userfeaturescache> {
    try{
      return this.prisma.userFeaturesCache.findUniqueOrThrow({ where: { id }, include: { User: true } });
    }catch(err){
      throw new Error('UserFeaturesCache not found');
    }
  }

  update(id: string, updateUserfeaturescacheInput: UpdateUserfeaturescacheInput) {
    this.prisma.userFeaturesCache.update({ where: { id }, data: updateUserfeaturescacheInput });
  }

  findByUserId(userId: string): Promise<Userfeaturescache> {
    try{
      return this.prisma.userFeaturesCache.findUniqueOrThrow({ where: { user_id: userId }, include: { User: true } });
    }catch(err){
      throw new Error('UserFeaturesCache not found');
    }
  }

  // remove(id: string) {
  //   return `This action removes a #${id} userfeaturescache`;
  // }
}
