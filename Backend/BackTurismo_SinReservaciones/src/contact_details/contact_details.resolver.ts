import { UseGuards } from '@nestjs/common';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ContactDetailsService } from './contact_details.service';
import { Contact_details } from '@prisma/client'; 
import { CreateContactInput } from './dto/create-contact-detail.input';
import { UpdateContactInput } from './dto/update-contact-detail.input';
import { Contact_detail } from './entities/contact_detail.entity';

@Resolver()
export class ContactDetailsResolver {

   constructor(
      private readonly contact_detail_service: ContactDetailsService
   ){}

   @Mutation(() => Contact_detail, {name: 'createContact'})
   createContact(@Args('createCategoryInput') createContactInput: CreateContactInput)
   {
      return this.contact_detail_service.create(createContactInput);
   }

   @Query(() => [Contact_detail], { name: 'getContactDetails' })
   async findAll(
   @Args('limit', { type: () => Int, nullable: true }) limit?: number,
   @Args('offset', { type: () => Int, nullable: true }) offset?: number,
   @Args('search', { type: () => String, nullable: true }) search?: string,
   ) {
   return this.contact_detail_service.findAll({
      take: limit || 10,   // Si no mandan límite, por defecto trae 10
      skip: offset || 0,   // Si no mandan offset, empieza desde el inicio
      where: search ? {
         OR: [
         { email: { contains: search, mode: 'insensitive' } },
         { phone_number: { contains: search } }
         ]
      } : undefined
   });
   }


  @Query(() => Contact_detail, { name: 'contactDetail', nullable: true})
  findOne(
   @Args('id', { type: () => ID}) id: string
   
  ){
   return this.contact_detail_service.findOne(id)
  }


}
