import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAddressInput } from './dto/create-address.input';
import { UpdateAddressInput } from './dto/update-address.input';

// maneja las direcciones de los usuarios con borrado lógico
@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  // crea una dirección si el estado existe en la base
  async createAddress(input: CreateAddressInput) {
    const stateExists = await this.prisma.state.findUnique({
      where: { id: input.state_id },
    });
    if (!stateExists) {
      throw new NotFoundException(`Estado ${input.state_id} no encontrado`);
    }

    return this.prisma.address.create({ data: input });
  }

  // obtiene las direcciones activas de todos los usuarios
  async findAll() {
    return this.prisma.address.findMany({
      where: { deleted_at: null },
      orderBy: { created_at: 'desc' },
    });
  }

  // busca una dirección por su id sin importar si está borrada
  async findById(id: string) {
    const address = await this.prisma.address.findUnique({ where: { id } });
    if (!address) throw new NotFoundException(`Dirección ${id} no encontrada`);
    return address;
  }

  // obtiene las direcciones activas de un usuario específico
  async findAddressesByUser(userId: string) {
    return this.prisma.address.findMany({
      where: { user_id: userId, deleted_at: null },
      orderBy: { created_at: 'desc' },
    });
  }

  // obtiene todas las direcciones del usuario (incluso borradas)
  async findAllAddressesByUser(userId: string) {
    return this.prisma.address.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  // actualiza los datos de una dirección existente
  async updateAddress(input: UpdateAddressInput) {
    await this.findById(input.id);

    const { id, ...data } = input;
    return this.prisma.address.update({ where: { id }, data });
  }

  // marca una dirección como borrada sin eliminarla realmente
  async softDeleteAddress(id: string) {
    await this.findById(id);

    return this.prisma.address.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  // recupera una dirección que fue borrada antes
  async restoreAddress(id: string) {
    await this.findById(id);

    return this.prisma.address.update({
      where: { id },
      data: { deleted_at: null },
    });
  }

  // borra una dirección de forma permanente de verdad
  async hardDeleteAddress(id: string) {
    await this.findById(id);

    await this.prisma.address.delete({ where: { id } });
    return { success: true };
  }

  // obtiene el estado asociado a una dirección
  async getAddressState(stateId: string) {
    return this.prisma.state.findUnique({ where: { id: stateId } });
  }

  // obtiene el país asociado a una dirección
  async getAddressCountry(countryId: string) {
    return this.prisma.country.findUnique({ where: { id: countryId } });
  }
}

