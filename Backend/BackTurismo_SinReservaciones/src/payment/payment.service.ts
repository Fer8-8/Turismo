import { Injectable } from '@nestjs/common';
import { CreatePaymentInput } from './dto/create-payment.input';
import { UpdatePaymentInput } from './dto/update-payment.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Payment } from '@prisma/client';
// import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentInput: CreatePaymentInput, user_id: string): Promise<Payment> {
    const { card_number_hashed, ...rest } = createPaymentInput;

    // Extraer los últimos 4 dígitos antes de hashear
    const last4Str = String(card_number_hashed).slice(-4);

    // // Función para crear el hash (usando SHA-256)
    // const hashData = (data: string) =>
    //   crypto.createHash('sha256').update(String(data)).digest('hex');

    return await this.prisma.payment.create({
      data: {
        card_number_hashed,
        ...rest,
        last_4: last4Str,
        user_id
      } as any,
      include: {
        user: true
      }
    });
  }

  async findAll(): Promise<Payment[]> {
    return await this.prisma.payment.findMany({
      include: {
        user: true
      }});
  }

  async findOne(id: string): Promise<Payment> {
    try{
      return await this.prisma.payment.findUniqueOrThrow({
        where: {
          id
        },
        include: {
          user: true
        }
      });
    }catch(error){
      throw new Error(error);
    }
  }

  async update(id: string, updatePaymentInput: UpdatePaymentInput): Promise<Payment> {
    return await this.prisma.payment.update({
      where: {
        id
      },
      data: updatePaymentInput,
      include: {
        user: true
      }
    });
  }

  async paymentsByUser(user_id: string): Promise<Payment[]> {
    return await this.prisma.payment.findMany({
      where: {
        user_id
      },
      include: {
        user: true
      }
    });
  }

  remove(id: string) {
    return `This action removes a #${id} payment`;
  }
}
