import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryInput: CreateCategoryInput): Promise<Category> {
    return this.prisma.categories.create({
      data: createCategoryInput,
    });
  }

  async findAll(): Promise<Category[]> {
    return this.prisma.categories.findMany({
      orderBy: { category: 'asc' },
    });
  }

  async findOne(id_category: string): Promise<Category> {
    try {
      return await this.prisma.categories.findUniqueOrThrow({
        where: { id_category },
      });
    } catch {
      throw new NotFoundException('Category not found');
    }
  }

  async update(updateCategoryInput: UpdateCategoryInput): Promise<Category> {
    return this.prisma.categories.update({
      where: { id_category: updateCategoryInput.id_category },
      data: { category: updateCategoryInput.category },
    });
  }

  async remove(id_category: string): Promise<Category> {
    return this.prisma.categories.delete({
      where: { id_category },
    });
  }
}
