import { Injectable } from '@nestjs/common';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';
import { Tag } from './entities/tag.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createTagInput: CreateTagInput): Promise<Tag> {
    return this.prisma.tags.create({ data: createTagInput });
  }

  findAll(): Promise<Tag[]> {
    return this.prisma.tags.findMany();
  }

  findOne(id: string): Promise<Tag> {
    try{ 
      return this.prisma.tags.findUniqueOrThrow({ where: { id } });
    }catch(error){
      throw new Error(error);
    }
  }

  update(id: string, updateTagInput: UpdateTagInput): Promise<Tag> {
    try{
      return this.prisma.tags.update({ where: { id }, data: updateTagInput });
    }catch(error){
      throw new Error(error);
    }
  }
}
