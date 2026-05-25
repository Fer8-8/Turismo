import { Injectable } from '@nestjs/common';
import { AddressService } from '../address.service';

// api pública direcciones usuario
@Injectable()
export class AddressFacade {
  constructor(private readonly addressService: AddressService) {}

  // busca una dirección por id
  getAddressById(id: string) {
    return this.addressService.findById(id);
  }

  // devuelve las direcciones activas de un usuario
  getAddressesByUser(userId: string) {
    return this.addressService.findAddressesByUser(userId);
  }

  // crea una dirección nueva
  createAddress(input: Parameters<AddressService['createAddress']>[0]) {
    return this.addressService.createAddress(input);
  }

  // actualiza una dirección
  updateAddress(input: Parameters<AddressService['updateAddress']>[0]) {
    return this.addressService.updateAddress(input);
  }

  // borrado lógico de una dirección
  softDeleteAddress(id: string) {
    return this.addressService.softDeleteAddress(id);
  }
}
