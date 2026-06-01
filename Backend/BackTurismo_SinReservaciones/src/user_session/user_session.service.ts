import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserSessionInput } from './dto/create-user_session.input';
import { UpdateUserSessionInput } from './dto/update-user_session.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserSession } from './entities/user_session.entity';
import { PaginationArgs } from 'src/common/pagination/args/pagination.args';
import { UserSessionResponse } from './dto/user-session-response.dto';
import { device_types } from "./enums/device_types.enum";

@Injectable()
export class UserSessionService {
  constructor(private prisma: PrismaService) {}

  async create(createUserSessionInput: CreateUserSessionInput): Promise<UserSession> {
    return this.prisma.userSession.create({
      data: createUserSessionInput,
      include: {
        User: true,
        RecommendationLogs: true,
      }
    });
  }

  async findAll(
    user_ids: string[],
    device_types: device_types[],
    paginationArgs: PaginationArgs
  ): Promise<UserSessionResponse> {
    const { current = 1 } = paginationArgs;
    const limit = 20;
    const skip = (current - 1) * limit;

    const where: any = {};
    if (user_ids && user_ids.length > 0) where.user_id = { in: user_ids };
    if (device_types && device_types.length > 0) where.device_type = { in: device_types };

    const [ user_sessions, totalCount ] = await Promise.all([
      this.prisma.userSession.findMany({
        where,
        skip,
        take: limit,
        orderBy: { started_at: 'desc' },
        include: {
          User: true,
          RecommendationLogs: true,
        }
      }),
      this.prisma.userSession.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      info: {
        count: totalCount,
        pages: totalPages,
        next: current < totalPages ? current + 1 : undefined,
        prev: current > 1 ? current - 1 : undefined,
      },
      user_sessions,
    };
  }

  async findOne(id: string): Promise<UserSession> {
    try {
      return await this.prisma.userSession.findUniqueOrThrow({
        where: { id },
        include: {
          User: true,
          RecommendationLogs: true,
        }
      });

    } catch (e) {
      throw new NotFoundException("User session not found");
    }
  }

  async update(id: string, updateUserSessionInput: UpdateUserSessionInput): Promise<UserSession> {
    return this.prisma.userSession.update({
      where: { id },
      data: updateUserSessionInput,
      include: {
        User: true,
        RecommendationLogs: true,
      }
    });
  }

  // remove(id: number) {
  //   return `This action removes a #${id} userSession`;
  // }
}
