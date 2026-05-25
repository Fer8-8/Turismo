import { AddressFacade } from './address.facade';

describe('AddressFacade', () => {
  let facade: AddressFacade;
  let addressService: {
    findById: jest.Mock;
    findAddressesByUser: jest.Mock;
    createAddress: jest.Mock;
    updateAddress: jest.Mock;
    softDeleteAddress: jest.Mock;
  };

  beforeEach(() => {
    addressService = {
      findById: jest.fn(),
      findAddressesByUser: jest.fn(),
      createAddress: jest.fn(),
      updateAddress: jest.fn(),
      softDeleteAddress: jest.fn(),
    };

    facade = new AddressFacade(addressService as any);
  });

  it('delegates createAddress through the public facade', async () => {
    const input = { firstname: 'Juan', lastname: 'Perez', state_id: 'state-1' };
    addressService.createAddress.mockResolvedValue({ id: 'address-1' });

    await facade.createAddress(input as any);

    expect(addressService.createAddress).toHaveBeenCalledWith(input);
  });

  it('delegates softDeleteAddress by id', async () => {
    addressService.softDeleteAddress.mockResolvedValue({ id: 'address-1' });

    await facade.softDeleteAddress('address-1');

    expect(addressService.softDeleteAddress).toHaveBeenCalledWith('address-1');
  });
});