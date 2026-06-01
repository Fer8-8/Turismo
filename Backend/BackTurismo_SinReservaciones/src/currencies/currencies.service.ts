import { Injectable } from '@nestjs/common';
import { CreateCurrencyInput } from './dto/create-currency.input';
import { UpdateCurrencyInput } from './dto/update-currency.input';
import { Currency } from './entities/currency.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CurrenciesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCurrencyInput: CreateCurrencyInput): Promise<Currency> {
    return this.prisma.currencies.create({ data: createCurrencyInput, include: { users: true } });
  }

  findAll(): Promise<Currency[]> {
    return this.prisma.currencies.findMany({ include: { users: true } });
  }

  findOne(id: string): Promise<Currency> {
    try{
    return this.prisma.currencies.findUniqueOrThrow({ where: { id }, include: { users: true } });
    }catch(err){
      throw new Error(err.message);
    }
  }

  update(id: string, updateCurrencyInput: UpdateCurrencyInput): Promise<Currency> {
    const { id: _, ...data } = updateCurrencyInput;
    return this.prisma.currencies.update({ 
      where: { id }, 
      data: data, include: { users: true }
    }) as unknown as Promise<Currency>;
  }

  // remove(id: string): Promise<Currency> {
  //   return `This action removes a #${id} currency`;
  // }
}
