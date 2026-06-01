import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Contact_details, Prisma } from '@prisma/client'; 
import { CreateContactInput } from './dto/create-contact-detail.input';
import { Contact_detail } from './entities/contact_detail.entity';

@Injectable()
export class ContactDetailsService {
   constructor(
      private prisma: PrismaService
   ){}

   async findAll(params: {
      skip?: number;  // Cuántos registros saltar (offset)
      take?: number;  // Cuántos registros traer (limit)
      where?: Prisma.Contact_detailsWhereInput;
      orderBy?: Prisma.Contact_detailsOrderByWithRelationInput;
   }): Promise<Contact_details[]> {
      const { skip, take, where, orderBy } = params;

      return this.prisma.contact_details.findMany({
         skip,    
         take,    
         where,   
         orderBy,
      });
   }

   async findOne(id: string): Promise<Contact_details | null> {
      return this.prisma.contact_details.findUnique({
        where: { id },
      });
    }


    async create(data: CreateContactInput): Promise<Contact_details> {
      return this.prisma.contact_details.create({
         data,
      });
    }
}