import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CustomerReturnNotFoundException } from '../../domain/exceptions/fulfillment.exceptions';
import {
  CreateCustomerReturnData,
  CUSTOMER_RETURN_INCLUDE,
  generateReturnNumber,
} from './return-repository.types';

@Injectable()
export class CustomerReturnRepository {
  constructor(private readonly prisma: PrismaService) {}

  createCustomerReturn(data: CreateCustomerReturnData) {
    const createData = {
      number: generateReturnNumber('CR'),
      stock_location_id: data.stock_location_id ?? null,
      store_id: data.store_id ?? null,
    } satisfies Prisma.CustomerReturnUncheckedCreateInput;

    return this.prisma.customerReturn.create({
      data: createData,
      include: CUSTOMER_RETURN_INCLUDE,
    });
  }

  findCustomerReturnById(id: string) {
    return this.prisma.customerReturn.findUnique({
      where: { id },
      include: CUSTOMER_RETURN_INCLUDE,
    });
  }

  async findCustomerReturnByIdOrThrow(id: string) {
    const customerReturn = await this.findCustomerReturnById(id);
    if (!customerReturn) {
      throw new CustomerReturnNotFoundException(id);
    }

    return customerReturn;
  }

  async attachItemsToCustomerReturn(customerReturnId: string, itemIds: string[]) {
    await this.findCustomerReturnByIdOrThrow(customerReturnId);

    await this.prisma.returnItem.updateMany({
      where: { id: { in: itemIds } },
      data: {
        customer_return_id: customerReturnId,
        reception_status: 'received',
        updated_at: new Date(),
      },
    });

    return this.findCustomerReturnByIdOrThrow(customerReturnId);
  }
}