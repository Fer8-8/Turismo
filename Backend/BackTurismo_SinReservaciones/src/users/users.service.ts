import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    // Nota: El registro se hará principalmente a través del AuthResolver
    // Pero si un admin crea un usuario, lo manejamos aquí.
    
    return this.prisma.user.create({
      data: {
        id: crypto.randomUUID(), // O el ID que prefieras si no viene de un proveedor de auth
        name: createUserInput.name,
        email: createUserInput.email,
        role: createUserInput.role,
        managedStateId: createUserInput.managedStateId,
        image: createUserInput.image,
        id_language: createUserInput.id_language,
        id_currency: createUserInput.id_currency,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        payments: true,
        languages: true,
        currencies: true,
        userFeaturesCache: true
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        payments: true,
        languages: true,
        currencies: true,
        userFeaturesCache: true
      },
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    console.log(updateUserInput);
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserInput,
      },
      include: {
        languages: true,
        payments: true,
        currencies: true,
        userFeaturesCache: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }
}
