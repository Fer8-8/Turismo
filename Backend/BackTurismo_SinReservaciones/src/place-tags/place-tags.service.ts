import { Injectable } from '@nestjs/common';
import { CreatePlaceTagInput } from './dto/create-place-tag.input';
import { UpdatePlaceTagInput } from './dto/update-place-tag.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlaceTag } from "./entities/place-tag.entity"

@Injectable()
export class PlaceTagsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPlaceTagInput: CreatePlaceTagInput): Promise<PlaceTag> {
    return await this.prisma.placeTags.create({
      data: createPlaceTagInput,
      include: {
        Place: true,
        Tag: true
      }
    })
  }

  async findAll(): Promise<PlaceTag[]> {
    return await this.prisma.placeTags.findMany({
      include: {
        Place: true,
        Tag: true
      }
    })
  }

  async findOne(id: string): Promise<PlaceTag> {
    return await this.prisma.placeTags.findUniqueOrThrow({
      where:{ id },
      include: {
        Place: true,
        Tag: true
      }
    })
  }

  async update(id: string, updatePlaceTagInput: UpdatePlaceTagInput): Promise<PlaceTag> {
    return await this.prisma.placeTags.update({
      where: { id },
      data: updatePlaceTagInput,
      include: {
        Place: true,
        Tag: true
      }
    })
  }

  remove(id: string) {
    return `This action removes a #${id} placeTag`;
  }
}
