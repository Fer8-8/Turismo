import { Injectable, NotFoundException, BadRequestException, Request } from '@nestjs/common';
import { CreatePlaceRequestInput } from './dto/create-place_request.input';
import { UpdatePlaceRequestInput } from './dto/update-place_request.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlaceRequest } from './entities/place_request.entity';
import { RequestMapper } from './mappers/request.mapper';
import { PaginationArgs } from 'src/common/pagination/args/pagination.args';
import { PlaceRequestResponse } from './dto/place_request-response.dto';
import { request_status } from './enums/status.enum';
import { User } from 'src/users/entities/user.entity';
import { Role } from '@prisma/client';
import { PlaceRequestFilterArgs } from './args/request-filter.args';
import { PlaceRequestPolicies } from './policies/place_request.policies';
import { CreatePlaceInput } from 'src/places/dto/create-place.input';
import { PlacesService } from 'src/places/places.service';

@Injectable()
export class PlaceRequestService {
  constructor(private prisma: PrismaService, private placesService: PlacesService) { }

  async create(createPlaceRequestInput: CreatePlaceRequestInput): Promise<PlaceRequest> {
    const data = RequestMapper.toPrismaCreate(createPlaceRequestInput);

    const request = await this.prisma.placeRequest.create({
      data,
      include: {
        user: true,
        place: true
      }
    });

    return RequestMapper.toEntity(request);
  }

  async findAll(user: User, paginationArgs: PaginationArgs, filterArgs: PlaceRequestFilterArgs): Promise<PlaceRequestResponse> {
    const { current = 1 } = paginationArgs;
    const { state_ids, status } = filterArgs;
    const limit = 20;
    const skip = (current - 1) * limit;

    const where: any = {};
    if (user.role === Role.partner || user.role === Role.user) where.id_user = user.id;
    
    if (user.role === Role.adminState) {
      where.place_json = {
        path: ["state_id"],
        equals: user.managedStateId
      };
    }

    if (user.role === Role.admin && state_ids?.length) {
      where.place_json = {
        path: ["state_id"],
        in: state_ids
      };
    }

    if (status) where.status = status;

    const [ prismaRequests, totalCount ] = await Promise.all([
      this.prisma.placeRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: {
          user: true,
          place: true,
        }
      }),
      this.prisma.placeRequest.count({ where }),
    ]);

    const place_requests = prismaRequests.map(RequestMapper.toEntity);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      info: {
        count: totalCount,
        pages: totalPages,
        next: current < totalPages ? current + 1 : undefined,
        prev: current > 1 ? current - 1 : undefined,
      },
      place_requests,
    }
  }

  async findOne(user: User, id: string): Promise<PlaceRequest> {
    try {
      const request = await this.prisma.placeRequest.findUniqueOrThrow({
        where: { id },
        include: {
          user: true,
          place: true,
        }
      });

      PlaceRequestPolicies.checkCanView(user, request as any);

      return RequestMapper.toEntity(request);

    } catch (e) {
      throw new NotFoundException("Place request no encontrada");
    }
  }

  async update(user: User, id: string, updatePlaceRequestInput: UpdatePlaceRequestInput): Promise<PlaceRequest> {
    PlaceRequestPolicies.checkCanUpdateStatus(user, updatePlaceRequestInput.status);

    const existingRequest = await this.prisma.placeRequest.findUnique({
      where: { id }
    });

    if (!existingRequest) throw new NotFoundException(`Place request #${id} not found`);
    PlaceRequestPolicies.checkCanView(user, existingRequest as any);
    PlaceRequestPolicies.checkIsModifiable(existingRequest.status);

    const data: any = RequestMapper.toPrismaUpdate(updatePlaceRequestInput);

    if (data.place_json) {
      const existingPlaceJson = existingRequest.place_json as Record<string, any>;

      const mergedPlaceJson = {
        ...existingPlaceJson,
        ...data.place_json
      };

      const changes = Object.keys(data.place_json)
        .filter(key => existingPlaceJson[key] !== mergedPlaceJson[key])
        .map(key => ({
          field: key,
          old_value: existingPlaceJson[key],
          new_value: mergedPlaceJson[key]
        }));

        const historyEntry = {
          changed_at: new Date(),
          changes
        };

        const currentHistory = Array.isArray(existingRequest.history_json)
          ? existingRequest.history_json
          : [];

        data.history_json = [...currentHistory, historyEntry];
        data.place_json = mergedPlaceJson;
    }

    const request = await this.prisma.placeRequest.update({
      where: { id },
      data,
      include: {
        user: true,
        place: true,
      }
    });

    if (updatePlaceRequestInput.status === request_status.approved && request.user.role === Role.user) {
      await this.prisma.user.update({
        where: { id: request.id_user },
        data: { role: Role.partner },
      });
      request.user.role = Role.partner;
    }

    return RequestMapper.toEntity(request);
  }

  remove(id: string) {
    return `This action removes a #${id} placeRequest`;
  }

  async review(user: User, id: string, status: request_status): Promise<PlaceRequest> {
    if (status === request_status.pending) throw new BadRequestException("El estado de revisión debe ser 'approved' o 'rejected'");

    return await this.prisma.$transaction(async (tx) => {
      const request = await tx.placeRequest.findUnique({
        where: { id },
        include: { user: true }
      });

      if (!request) throw new NotFoundException(`Place request #${id} no encontrada`);
      PlaceRequestPolicies.checkCanView(user, request as any);
      if (request.status !== request_status.pending) throw new BadRequestException(`Esta solicitud ya fue procesada previamente (${request.status})`);

      let newPlaceId: string | null = null;

      if (status === request_status.approved) {
        const placeDraft = request.place_json as unknown as CreatePlaceInput;

        const newPlace = await this.placesService.create(user, placeDraft, tx);

        newPlaceId = newPlace.id;

        if (request.user.role === Role.user) {
          await tx.user.update({
            where: { id: request.id_user },
            data: { role: Role.partner },
          });
        }
      }

      const updatedRequest = await tx.placeRequest.update({
        where: { id },
        data: {
          status,
          ...(newPlaceId && { id_place: newPlaceId }),
        },
        include: {
          user: true,
          place: true,
        }
      });

      return RequestMapper.toEntity(updatedRequest);
    });
  }
}
