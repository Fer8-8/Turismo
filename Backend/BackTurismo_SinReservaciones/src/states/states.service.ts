import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStateInput } from './dto/create-state.input';
import { UpdateStateInput } from './dto/update-state.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { State } from './entities/state.entity';
import { ValidRegions } from './enums/valid-regions.enum';

@Injectable()
export class StatesService {
  constructor(private prisma: PrismaService) {}

  async create(createStateInput: CreateStateInput): Promise<State> {
    return this.prisma.states.create({
      data: createStateInput as any,
      include: {
        places: true,
      }
    });
  }

  async findAll(
    regions: ValidRegions[], 
    name: string[]
  ): Promise<State[]> {
    const where: any = {};
    if (regions && regions.length > 0) where.region = { in: regions };
    if (name && name.length > 0) where.name = { in: name };

    const states = await this.prisma.states.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        places: true,
      }
    });

    return states;
  }

  async findOne(id: string): Promise<State> {
    try {
      return await this.prisma.states.findUniqueOrThrow({
        where: { id },
        include: {
          places: true,
        }
      });
    } catch (e) {
      throw new NotFoundException('State not found');
    }
  }

  update(id: string, updateStateInput: UpdateStateInput): Promise<State> {
    return this.prisma.states.update({
      where: { id },
      data: updateStateInput,
      include: {
        places: true,
      }
    });
  }
}
