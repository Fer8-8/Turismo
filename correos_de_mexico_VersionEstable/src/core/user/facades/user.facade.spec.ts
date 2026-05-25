import { UserFacade } from './user.facade';

describe('UserFacade', () => {
  let facade: UserFacade;
  let userService: {
    findBusinessUser: jest.Mock;
    findBusinessUserByEmail: jest.Mock;
    findBusinessUserByLogin: jest.Mock;
    getMinimalProfile: jest.Mock;
    validateUserExists: jest.Mock;
    validateUserActive: jest.Mock;
    getUserRoles: jest.Mock;
    hasRole: jest.Mock;
    getUserShipAddress: jest.Mock;
    getUserBillAddress: jest.Mock;
    getUserStoreCreditBalance: jest.Mock;
    findAuthUserByEmail: jest.Mock;
  };

  beforeEach(() => {
    userService = {
      findBusinessUser: jest.fn(),
      findBusinessUserByEmail: jest.fn(),
      findBusinessUserByLogin: jest.fn(),
      getMinimalProfile: jest.fn(),
      validateUserExists: jest.fn(),
      validateUserActive: jest.fn(),
      getUserRoles: jest.fn(),
      hasRole: jest.fn(),
      getUserShipAddress: jest.fn(),
      getUserBillAddress: jest.fn(),
      getUserStoreCreditBalance: jest.fn(),
      findAuthUserByEmail: jest.fn(),
    };

    facade = new UserFacade(userService as any);
  });

  it('delegates getMinimalProfile preserving the reduced public shape', async () => {
    const profile = {
      id: 'user-1',
      name: 'Samuel',
      email: 'samuel@example.com',
      login: 'samuel',
      locked: false,
      ship_address_id: 'ship-1',
      bill_address_id: 'bill-1',
      roles: ['admin'],
    };
    userService.getMinimalProfile.mockResolvedValue(profile);

    await expect(facade.getMinimalProfile('user-1')).resolves.toEqual(profile);
    expect(userService.getMinimalProfile).toHaveBeenCalledWith('user-1');
  });

  it('delegates role checks for authorization decisions', async () => {
    userService.hasRole.mockResolvedValue(true);

    await expect(facade.hasRole('user-1', 'admin')).resolves.toBe(true);
    expect(userService.hasRole).toHaveBeenCalledWith('user-1', 'admin');
  });

  it('delegates store-credit balance lookup', async () => {
    userService.getUserStoreCreditBalance.mockResolvedValue(15.5);

    await expect(facade.getUserStoreCreditBalance('user-1')).resolves.toBe(15.5);
    expect(userService.getUserStoreCreditBalance).toHaveBeenCalledWith('user-1');
  });
});