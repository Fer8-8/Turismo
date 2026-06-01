import { Injectable } from '@nestjs/common';
import { CreatePlannerInput } from './dto/create-planner.input';
import { UpdatePlannerInput } from './dto/update-planner.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Planner } from './entities/planner.entity';
import { PlannerStatus } from './enums/valid-status.enum';
import { PaginationArgs } from 'src/common/pagination/args/pagination.args';
import { PlannerResponse } from './dto/planner-response.dto';


@Injectable()
export class PlannerService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createPlannerInput: CreatePlannerInput) : Promise<Planner> {
    try{
      return await this.prisma.planner.create({
        data: createPlannerInput,
      });
    }catch(error){
      throw new Error('Error al crear el planner');
    }
  }

  async findAll(
    status: PlannerStatus,
    paginationArgs: PaginationArgs
  ) : Promise<PlannerResponse> {
    const {current = 1} = paginationArgs;
    const limit = 10;
    const skip = (current - 1) * limit;

    const where:any = {};

    if(status && status.length > 0) where.status = {in: status};

    const [planners, totalCount] = await Promise.all([
      
      this.prisma.planner.findMany({
        where,
        take: limit,
        skip,
      }),
      this.prisma.planner.count({where})
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      info: {
        count: totalCount,
        pages: totalPages,
        next: current < totalPages ? current + 1 : undefined,
        prev: current > 1 ? current - 1 : undefined,
      },
      planners,
    };
  }

  async findOne(id: string) : Promise<Planner> {
    try{
      return await this.prisma.planner.findUniqueOrThrow({
        where: { id },
      });
    }catch(error){
      throw new Error('Planner no encontrado');
    }
  }

  async update(id: string, updatePlannerInput: UpdatePlannerInput) : Promise<Planner> {
    try{
      return await this.prisma.planner.update({
        where: { id },
        data: updatePlannerInput,
      });
    }catch(error){
      throw new Error('Error al actualizar el planner');
    }
  }

  async remove(id: string) : Promise<Planner> {
    try{
      return await this.prisma.planner.delete({
        where: { id },
      });
    }catch(error){
      throw new Error('Error al eliminar el planner');
    }
  }
}
