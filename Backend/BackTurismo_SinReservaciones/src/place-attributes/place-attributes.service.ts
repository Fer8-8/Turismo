import { Injectable } from '@nestjs/common';
import { CreatePlaceAttributeInput } from './dto/create-place-attribute.input';
import { UpdatePlaceAttributeInput } from './dto/update-place-attribute.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlaceAttribute } from './entities/place-attribute.entity';

@Injectable()
export class PlaceAttributesService {

  constructor(private readonly prisma: PrismaService) {}

  create(createPlaceAttributeInput: CreatePlaceAttributeInput) {
    return this.prisma.placeAttributes.create({
      data: createPlaceAttributeInput,
      include: {
        Place: true,
      },
    });
  }

  async findAll(): Promise<PlaceAttribute[]> {
    return this.prisma.placeAttributes.findMany({
      include: {
        Place: true,
      }
    });
  }

  findOne(id: string): Promise<PlaceAttribute> {
    try{
      return this.prisma.placeAttributes.findUniqueOrThrow({
        where: { id },
        include: {
          Place: true,
        },
      });
    }catch(err){
      throw new Error(`Place attribute with id ${id} not found`);
    }
  }

  update(id: string, updatePlaceAttributeInput: UpdatePlaceAttributeInput) {
    return this.prisma.placeAttributes.update({
      where: { id },
      data: updatePlaceAttributeInput,
      include: {
        Place: true,
      },
    });
  }

  // remove(id: string) {
  //   return this.prisma.placeAttributes.delete({
  //     where: { id },
  //   });
  // }
}
