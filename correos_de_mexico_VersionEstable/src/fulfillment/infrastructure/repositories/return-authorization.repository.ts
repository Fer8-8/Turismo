import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  ReturnAuthorizationNotFoundException,
} from '../../domain/exceptions/fulfillment.exceptions';
import {
  CreateReturnAuthorizationData,
  RETURN_AUTHORIZATION_INCLUDE,
  ReturnAuthorizationFilters,
  UpdateReturnAuthorizationData,
  generateReturnNumber,
} from './return-repository.types';

@Injectable()
export class ReturnAuthorizationRepository {
  constructor(private readonly prisma: PrismaService) {}

  createAuthorization(data: CreateReturnAuthorizationData) {
    const now = new Date();
    const createData = {
      number: generateReturnNumber('RA'),
      order_id: data.order_id,
      memo: data.memo ?? null,
      state: data.state,
      stock_location_id: data.stock_location_id ?? null,
      return_authorization_reason_id: data.return_authorization_reason_id ?? null,
      created_at: now,
      updated_at: now,
    } satisfies Prisma.ReturnAuthorizationUncheckedCreateInput;

    return this.prisma.returnAuthorization.create({
      data: createData,
      include: RETURN_AUTHORIZATION_INCLUDE,
    });
  }

  findAuthorizationById(id: string) {
    return this.prisma.returnAuthorization.findUnique({
      where: { id },
      include: RETURN_AUTHORIZATION_INCLUDE,
    });
  }

  async findAuthorizationByIdOrThrow(id: string) {
    const authorization = await this.findAuthorizationById(id);
    if (!authorization) {
      throw new ReturnAuthorizationNotFoundException(id);
    }

    return authorization;
  }

  listAuthorizations(filters: ReturnAuthorizationFilters) {
    const { orderId, state, reasonId, take = 50, skip = 0 } = filters;
    return this.prisma.returnAuthorization.findMany({
      where: {
        ...(orderId ? { order_id: orderId } : {}),
        ...(state ? { state } : {}),
        ...(reasonId
          ? { return_authorization_reason_id: reasonId }
          : {}),
      },
      include: RETURN_AUTHORIZATION_INCLUDE,
      orderBy: { created_at: 'desc' },
      take,
      skip,
    });
  }

  async updateAuthorization(id: string, data: UpdateReturnAuthorizationData) {
    await this.findAuthorizationByIdOrThrow(id);

    const updateData = {
      ...data,
      updated_at: new Date(),
    } satisfies Prisma.ReturnAuthorizationUncheckedUpdateInput;

    return this.prisma.returnAuthorization.update({
      where: { id },
      data: updateData,
      include: RETURN_AUTHORIZATION_INCLUDE,
    });
  }
}