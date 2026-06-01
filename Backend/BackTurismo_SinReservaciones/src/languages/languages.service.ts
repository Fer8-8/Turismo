import { Injectable } from '@nestjs/common';
import { CreateLanguageInput } from './dto/create-language.input';
import { UpdateLanguageInput } from './dto/update-language.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Language } from './entities/language.entity';

@Injectable()
export class LanguagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLanguageInput: CreateLanguageInput): Promise<Language> {
    return await this.prisma.languages.create({ data: createLanguageInput, include: { users: true } });
  }

  async findAll(): Promise<Language[]> {
    return await this.prisma.languages.findMany({ include: { users: true } });
  }

  async findOne(id: string): Promise<Language> {
    try{
      return await this.prisma.languages.findUniqueOrThrow({ where: { id }, include: { users: true } });
    }catch(error){
      throw new Error(error);
    }
  }

  async update(id: string, updateLanguageInput: UpdateLanguageInput): Promise<Language> {
    return await this.prisma.languages.update({ where: { id }, data: updateLanguageInput, include: { users: true } });
  }

  remove(id: string) {
    return `This action removes a #${id} language`;
  }
}
